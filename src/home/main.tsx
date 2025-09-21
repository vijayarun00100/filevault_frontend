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
    <div className='flex w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='flex flex-col w-64 bg-white/70 backdrop-blur-sm border-r border-white/20 h-full shadow-lg'>
        <div className='flex items-center gap-3 p-4 border-b border-white/20'>
          <div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white font-bold text-lg'>F</span>
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-800'>Hey {storedData.name}!</h1>
            <p className='text-xs text-gray-600'>Your FileVault</p>
          </div>
        </div>

        <div className='flex flex-col p-3 space-y-2'>
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg ${
              isUploading 
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed' 
                : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-[1.02]'
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
            className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-300'
          >
            {React.createElement(MdSearch as React.ComponentType<any>, { className: 'text-lg text-blue-600' })}
            Search
          </button>
          
          <button className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-300'>
            {React.createElement(MdSettings as React.ComponentType<any>, { className: 'text-lg text-purple-600' })}
            Settings
          </button>
          
          <div className='border-t border-white/30 my-3'></div>
          
          <button className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-300 bg-blue-50'>
            {React.createElement(MdFolder as React.ComponentType<any>, { className: 'text-lg text-blue-600' })}
            My Drive
          </button>
          
          <button className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-300'>
            {React.createElement(MdPeople as React.ComponentType<any>, { className: 'text-lg text-green-600' })}
            Shared with me
          </button>
          
          <button className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-300'>
            {React.createElement(MdDelete as React.ComponentType<any>, { className: 'text-lg text-red-600' })}
            Trash
          </button>
        </div>
      </div>

      <div className='flex-1 flex flex-col h-full'>
        <div className='flex items-center justify-between p-6 bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm'>
          <div className='flex items-center gap-4'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              {isSearchActive && searchQuery ? `Search results for "${searchQuery}"` : 'My Drive'}
            </h2>
          </div>
          <div className='flex items-center gap-4'>
            {isSearchActive && (
              <div className='flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 shadow-lg'>
                {React.createElement(MdSearch as React.ComponentType<any>, { className: 'text-blue-500' })}
                <input
                  type="text"
                  placeholder="Search your files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='bg-transparent outline-none text-sm w-64 placeholder-gray-500'
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={handleSearchClear} className='text-gray-400 hover:text-red-500 transition-colors'>
                    {React.createElement(MdClear as React.ComponentType<any>, { className: 'text-lg' })}
                  </button>
                )}
              </div>
            )}
            <div className='flex items-center gap-3'>
              <span className='text-sm font-medium text-gray-600'>Sort by</span>
              <select className='text-sm bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'>
                <option>Name</option>
                <option>Date modified</option>
                <option>Size</option>
              </select>
            </div>
          </div>
        </div>

        <div 
          className={`flex-1 p-8 overflow-auto relative ${
            isDragOver ? 'bg-blue-50/50 border-2 border-dashed border-blue-400' : ''
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver && (
            <div className='absolute inset-0 bg-gradient-to-br from-blue-50/90 to-purple-50/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 border-2 border-dashed border-blue-400 rounded-2xl'>
              {React.createElement(MdUpload as React.ComponentType<any>, { className: 'text-8xl text-blue-500 mb-6 animate-bounce' })}
              <h3 className='text-2xl font-bold text-blue-700 mb-3'>Drop files here!</h3>
              <p className='text-blue-600 text-lg'>Release to upload your files</p>
            </div>
          )}

          {Object.keys(uploadProgress).length > 0 && (
            <div className='mb-8 space-y-3'>
              <h4 className='text-lg font-semibold text-gray-800'>Uploading files...</h4>
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className='bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-sm font-medium text-gray-700 truncate'>{filename}</span>
                    <span className='text-sm font-bold text-blue-600'>{progress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-3'>
                    <div 
                      className='bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500'
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className='flex flex-col justify-center items-center h-64'>
              <div className='animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4'></div>
              <div className='text-gray-600 font-medium'>Loading your files...</div>
            </div>
          )}
          
          {error && (
            <div className='flex flex-col justify-center items-center h-64'>
              <div className='text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-200'>
                <p className='font-semibold'>Oops! Something went wrong</p>
                <p className='text-sm mt-1'>{error.message}</p>
              </div>
            </div>
          )}
          
          {data && data.userFiles && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredFiles.length === 0 ? (
                <div className='col-span-full flex flex-col items-center justify-center h-64 text-gray-500'>
                  {React.createElement(MdFolderOpen as React.ComponentType<any>, { className: 'text-8xl mb-6 text-gray-400' })}
                  <h3 className='text-xl font-bold mb-3 text-gray-700'>
                    {searchQuery ? 'No files found' : 'No files yet'}
                  </h3>
                  <p className='text-sm mb-6 text-gray-600'>
                    {searchQuery ? `No files match "${searchQuery}"` : 'Upload your first file to get started!'}
                  </p>
                  {!searchQuery && (
                    <div className='text-center'>
                      <button 
                        onClick={handleUploadClick}
                        className='inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold'
                      >
                        {React.createElement(MdUpload as React.ComponentType<any>, { className: 'text-xl' })}
                        Choose Files
                      </button>
                      <p className='text-sm text-gray-500 mt-3'>or drag and drop files here</p>
                    </div>
                  )}
                </div>
              ) : (
                filteredFiles.map((file: FileData) => {
                  const { icon: IconComponent, color } = getFileIcon(file.filename);
                  const uploadDate = new Date(file.uploadedAt).toLocaleDateString();
                  
                  return (
                    <div key={file.id} className='flex flex-col items-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:bg-white/80'>
                      <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        {React.createElement(IconComponent as React.ComponentType<any>, { className: 'text-3xl text-gray-700' })}
                      </div>
                      <h3 className='text-sm font-semibold text-gray-800 text-center mb-2' title={file.filename}>
                        {file.filename.length > 18 ? `${file.filename.substring(0, 18)}...` : file.filename}
                      </h3>
                      <p className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>Uploaded {uploadDate}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
        <div className='p-4 text-center border-t border-white/20'>
          <p className='text-s text-gray-500'>
            Created by vijayarun :)
          </p>
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
