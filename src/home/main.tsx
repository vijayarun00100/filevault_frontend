import React, { useState, useMemo, useRef } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { ApolloProvider, useQuery } from '@apollo/client/react';
import { toast } from 'react-toastify';
import { IconType } from 'react-icons';
import { 
  MdUpload, 
  MdSearch, 
  MdSettings, 
  MdFolder, 
  MdPeople, 
  MdDelete,
  MdFolderOpen,
  MdInsertDriveFile,
  MdImage,
  MdVideoFile,
  MdAudioFile,
  MdPictureAsPdf,
  MdCode,
  MdArchive,
  MdClear,
  MdDescription
} from 'react-icons/md';

interface FileData {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
}

interface UserFilesData {
  userFiles: FileData[];
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: "/query",
  }),
  cache: new InMemoryCache(),
});

const GET_USER_FILES = gql`
  query GetUserFiles($userID: ID!) {
    userFiles(userID: $userID) {
      id
      filename
      path
      uploadedAt
    }
  }
`;

const UPLOAD_FILE = gql`
  mutation UploadFile($userID: ID!, $file: Upload!) {
    uploadFile(userID: $userID, file: $file) {
      id
      filename
      path
      uploadedAt
    }
  }
`;

const storedData = JSON.parse(localStorage.getItem('user') || '{}');

const getFileIcon = (filename: string): { icon: IconType; color: string } => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return { icon: MdDescription, color: 'bg-red-100' };
    case 'doc':
    case 'docx':
      return { icon: MdDescription, color: 'bg-blue-100' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return { icon: MdImage, color: 'bg-green-100' };
    case 'mp4':
    case 'avi':
    case 'mov':
      return { icon: MdVideoFile, color: 'bg-purple-100' };
    case 'mp3':
    case 'wav':
      return { icon: MdAudioFile, color: 'bg-yellow-100' };
    default:
      return { icon: MdInsertDriveFile, color: 'bg-gray-100' };
  }
};

const DriveContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { loading, error, data, refetch } = useQuery<UserFilesData>(GET_USER_FILES, {
    variables: { userID: storedData.id },
    skip: !storedData.id,
  });

  const uploadFileToServer = async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    
    const operations = JSON.stringify({
      query: `
        mutation UploadFile($userID: ID!, $file: Upload!) {
          uploadFile(userID: $userID, file: $file) {
            id
            filename
            path
            uploadedAt
          }
        }
      `,
      variables: {
        userID: storedData.id,
        file: null
      }
    });
    
    const map = JSON.stringify({
      "0": ["variables.file"]
    });
    
    formData.append('operations', operations);
    formData.append('map', map);
    formData.append('0', file);
    
    try {
      const response = await fetch('/query', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data.uploadFile;
    } catch (error: any) {
      throw error;
    }
  };

  const uploadMultipleFiles = async (files: FileList) => {
    setIsUploading(true);
    const fileArray = Array.from(files);
    let successCount = 0;
    let errorCount = 0;

    for (const file of fileArray) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const result = await uploadFileToServer(file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        });
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        successCount++;
      } catch (error: any) {
        console.error(`Upload failed for ${file.name}:`, error);
        errorCount++;
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }

    // Show summary toast
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} file${errorCount > 1 ? 's' : ''}`);
    }

    setIsUploading(false);
    setUploadProgress({});
    refetch();
  };


  const filteredFiles = useMemo(() => {
    if (!data?.userFiles || !searchQuery.trim()) {
      return data?.userFiles || [];
    }
    return data.userFiles.filter(file => 
      file.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.userFiles, searchQuery]);

  const handleSearchClick = () => {
    setIsSearchActive(true);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await uploadMultipleFiles(files);
    

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadMultipleFiles(files);
    }
  };

  return (
    <div className='flex w-full h-screen bg-gray-50'>
      <div className='flex flex-col w-64 bg-white border-r border-gray-300 h-full'>
        <div className='flex items-center gap-3 p-4 border-b border-gray-300'>
          <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>D</span>
          </div>
          <div>
            <h1 className='text-lg font-medium text-gray-900'>hello {storedData.name} </h1>
            <p className='text-xs text-gray-500'>Welcome to your Drive</p>
          </div>
        </div>

        
        <div className='flex flex-col p-2 space-y-1'>
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
              isUploading 
                ? 'text-gray-400 bg-gray-300 cursor-not-allowed' 
                : 'text-white bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {React.createElement(MdUpload as React.ComponentType<any>, { className: 'text-lg' })}
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple={true}
            accept="*/*"
          />
          
          <button 
            onClick={handleSearchClick}
            className='flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100'
          >
            {React.createElement(MdSearch as React.ComponentType<any>, { className: 'text-lg' })}
            Search
          </button>
          
          <button className='flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100'>
            {React.createElement(MdSettings as React.ComponentType<any>, { className: 'text-lg' })}
            Settings
          </button>
          
          <div className='border-t border-gray-300 my-2'></div>
          
          <button className='flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100'>
            {React.createElement(MdFolder as React.ComponentType<any>, { className: 'text-lg' })}
            My Drive
          </button>
          
          <button className='flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100'>
            {React.createElement(MdPeople as React.ComponentType<any>, { className: 'text-lg' })}
            Shared with me
          </button>
          
          <button className='flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100'>
            {React.createElement(MdDelete as React.ComponentType<any>, { className: 'text-lg' })}
            Trash
          </button>
        </div>
      </div>

     
      <div className='flex-1 flex flex-col h-full'>
        
        <div className='flex items-center justify-between p-4 bg-white border-b border-gray-300'>
          <div className='flex items-center gap-4'>
            <h2 className='text-xl font-medium text-gray-900'>
              {isSearchActive && searchQuery ? `Search results for "${searchQuery}"` : 'My Drive'}
            </h2>
          </div>
          <div className='flex items-center gap-4'>
            {isSearchActive && (
              <div className='flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2'>
                {React.createElement(MdSearch as React.ComponentType<any>, { className: 'text-gray-400' })}
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='bg-transparent outline-none text-sm w-64'
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={handleSearchClear} className='text-gray-400 hover:text-gray-600'>
                    {React.createElement(MdClear as React.ComponentType<any>, { className: 'text-lg' })}
                  </button>
                )}
              </div>
            )}
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500'>Sort by</span>
              <select className='text-sm border border-gray-300 rounded px-2 py-1'>
                <option>Name</option>
                <option>Date modified</option>
                <option>Size</option>
              </select>
            </div>
          </div>
        </div>

        
        <div 
          className={`flex-1 p-6 overflow-auto relative ${
            isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragOver && (
            <div className='absolute inset-0 bg-blue-50 bg-opacity-90 flex flex-col items-center justify-center z-10 border-2 border-dashed border-blue-400 rounded-lg'>
              {React.createElement(MdUpload as React.ComponentType<any>, { className: 'text-6xl text-blue-500 mb-4' })}
              <h3 className='text-xl font-medium text-blue-700 mb-2'>Drop files here to upload</h3>
              <p className='text-blue-600'>Release to upload multiple files</p>
            </div>
          )}

          {/* Upload progress indicators */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className='mb-6 space-y-2'>
              <h4 className='text-sm font-medium text-gray-700'>Uploading files...</h4>
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className='bg-white rounded-lg p-3 border border-gray-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm text-gray-700 truncate'>{filename}</span>
                    <span className='text-xs text-gray-500'>{progress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div 
                      className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className='flex justify-center items-center h-64'>
              <div className='text-gray-500'>Loading your files...</div>
            </div>
          )}
          
          {error && (
            <div className='flex justify-center items-center h-64'>
              <div className='text-red-500'>Error loading files: {error.message}</div>
            </div>
          )}
          
          {data && data.userFiles && (
            <div className='grid grid-cols-4 gap-6'>
              {filteredFiles.length === 0 ? (
                <div className='col-span-4 flex flex-col items-center justify-center h-64 text-gray-500'>
                  {React.createElement(MdFolderOpen as React.ComponentType<any>, { className: 'text-6xl mb-4' })}
                  <h3 className='text-lg font-medium mb-2'>
                    {searchQuery ? 'No files found' : 'No files yet'}
                  </h3>
                  <p className='text-sm mb-4'>
                    {searchQuery ? `No files match "${searchQuery}"` : 'Upload your first file to get started'}
                  </p>
                  {!searchQuery && (
                    <div className='text-center'>
                      <button 
                        onClick={handleUploadClick}
                        className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                      >
                        {React.createElement(MdUpload as React.ComponentType<any>, { className: 'text-lg' })}
                        Choose Files
                      </button>
                      <p className='text-xs text-gray-400 mt-2'>or drag and drop files here</p>
                    </div>
                  )}
                </div>
              ) : (
                filteredFiles.map((file: FileData) => {
                  const { icon: IconComponent, color } = getFileIcon(file.filename);
                  const uploadDate = new Date(file.uploadedAt).toLocaleDateString();
                  
                  return (
                    <div key={file.id} className='flex flex-col items-center p-4 bg-white rounded-lg border border-gray-300 hover:shadow-md transition-shadow cursor-pointer'>
                      <div className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center mb-3`}>
                        {React.createElement(IconComponent as React.ComponentType<any>, { className: 'text-2xl text-gray-600' })}
                      </div>
                      <h3 className='text-sm font-medium text-gray-900 text-center mb-1' title={file.filename}>
                        {file.filename.length > 20 ? `${file.filename.substring(0, 20)}...` : file.filename}
                      </h3>
                      <p className='text-xs text-gray-500'>Uploaded {uploadDate}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function main() {
  return (
    <ApolloProvider client={client}>
      <DriveContent />
    </ApolloProvider>
  );
}
