import React, { useState, useMemo, useRef } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, gql, from } from '@apollo/client';
import { ApolloProvider, useQuery, useLazyQuery, useMutation } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
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
  MdDescription,
  MdDownload,
  MdShare,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdAdminPanelSettings,
  MdPerson,
  MdLogout
} from 'react-icons/md';
import AdminPanel from '../components/AdminPanel';
import { FaUpload, FaSearch, FaTimes, FaDownload, FaShare, FaCloud, FaHdd, FaTrash } from 'react-icons/fa';

interface FileData {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
  downloadFile?: string;
}

interface UserFilesData {
  userFiles: FileData[];
}

interface UserData {
  id: string;
  name?: string;
  email: string;
}

interface AllUsersData {
  users: UserData[];
}

const authLink = setContext((_, { headers }) => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  // console.log('Apollo authLink userData:', userData);
  // console.log('Apollo authLink token:', userData.token);
  return {
    headers: {
      ...headers,
      authorization: userData.token ? `Bearer ${userData.token}` : '',
    }
  };
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/query",
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const GET_USER_FILES = gql`
  query GetUserFiles($userID: ID!) {
    userFiles(userID: $userID) {
      id
      filename
      path
      uploadedAt
      downloadFile
      size
    }
  }
`;

const DOWNLOAD_FILE = gql`
  query DownloadFile($fileID: ID!) {
    downloadFile(fileID: $fileID) {
      id
      filename
      path
      uploadedAt
      downloadFile
      size
    }
  }
`;

const GET_STORAGE_INFO = gql`
  query GetStorageInfo($userID: ID!) {
    userStorageInfo(userID: $userID) {
      totalFiles
      totalSize
      formattedSize
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      email
    }
  }
`;

const DELETE_FILE = gql`
  mutation DeleteFile($fileID: ID!) {
    deleteFile(fileID: $fileID)
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
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentView, setCurrentView] = useState<'drive' | 'admin'>('drive');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data, loading, error, refetch } = useQuery<UserFilesData>(GET_USER_FILES, {
    variables: { userID: storedData.id },
    skip: !storedData.id,
  });

  const { data: storageData, loading: storageLoading } = useQuery(GET_STORAGE_INFO, {
    variables: { userID: storedData.id },
    skip: !storedData.id,
  });

  const { data: usersData, loading: usersLoading, error: usersError } = useQuery<AllUsersData>(GET_ALL_USERS, {
    skip: currentView !== 'admin' || !isAdminAuthenticated,
  });

  const [downloadFile] = useLazyQuery(DOWNLOAD_FILE);
  const [deleteFile] = useMutation(DELETE_FILE);

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
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Upload userData:', userData);
      console.log('Upload token:', userData.token);
      
      const response = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT || '/query', {
        method: 'POST',
        headers: {
          'Authorization': userData.token ? `Bearer ${userData.token}` : '',
        },
        body: formData,
      });
      
      const result = await response.json();
      console.log('Upload response:', result);
      
      if (result.errors) {
        console.error('Upload GraphQL errors:', result.errors);
        console.error('First error details:', result.errors[0]);
        throw new Error(result.errors[0].message);
      }
      
      return result.data.uploadFile;
    } catch (error: any) {
      console.error('Upload error details:', error);
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


  const files = (data as any)?.userFiles || [];
  const totalFiles = files.length || 0;
  
  const filteredFiles = useMemo(() => {
    if (!data?.userFiles) return [];
    
    let filtered = data.userFiles.filter(file =>
      file.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort files based on selected criteria
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename);
          break;
        case 'size':
          const aSize = (a as any).size || 0;
          const bSize = (b as any).size || 0;
          comparison = aSize - bSize;
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [data?.userFiles, searchQuery, sortBy, sortOrder]);

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

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const { data } = await downloadFile({ variables: { fileID: fileId } });
      if (data && (data as any).downloadFile && (data as any).downloadFile.downloadFile) {
        
        const link = document.createElement('a');
        link.href = (data as any).downloadFile.downloadFile;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading ${filename}`);
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleShare = async (fileId: string, filename: string) => {
    try {
      
      const { data } = await downloadFile({ variables: { fileID: fileId } });
      if (data && (data as any).downloadFile && (data as any).downloadFile.downloadFile) {
        
        const publicUrl = (data as any).downloadFile.downloadFile;
        const downloadUrl = `${publicUrl}?download=${encodeURIComponent(filename)}`;
        
        
        await navigator.clipboard.writeText(downloadUrl);
        toast.success(`Share link copied to clipboard!`);
      } else {
        throw new Error('Could not get file URL');
      }
    } catch (error: any) {
      console.error('Share error:', error);
      toast.error('Failed to copy share link');
    }
  };

  const handleDelete = async (fileId: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { data } = await deleteFile({ variables: { fileID: fileId } });
      if ((data as any)?.deleteFile) {
        toast.success(`"${filename}" deleted successfully!`);
        refetch(); // Refresh the file list
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete "${filename}"`);
    }
  };

  const handleAdminAccess = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = () => {
    if (adminPassword === 'admin') {
      setIsAdminAuthenticated(true);
      setCurrentView('admin');
      setShowPasswordPrompt(false);
      setAdminPassword('');
    } else {
      toast.error('Incorrect admin password');
      setAdminPassword('');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
    setAdminPassword('');
  };

  return (
    <div className='flex w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative'>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-white/30 h-full shadow-xl transition-transform duration-300 ease-in-out z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:relative lg:z-auto fixed left-0 top-0`}>
        <div className='flex items-center justify-between p-4 border-b border-white/30'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
              {React.createElement(FaCloud as React.ComponentType<any>, { className: 'text-white text-xl' })}
            </div>
            <div>
              <h1 className='text-lg font-bold text-gray-800'>FileVault</h1>
              <p className='text-sm text-gray-500'>Your secure cloud storage</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            {React.createElement(FaTimes as React.ComponentType<any>, { className: 'text-gray-600' })}
          </button>
        </div>

        
        <div className='p-4 border-b border-white/20'>
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3'>
            <div className='flex items-center gap-2 mb-2'>
              {React.createElement(FaHdd as React.ComponentType<any>, { className: 'text-blue-600' })}
              <span className='text-sm font-medium text-gray-700'>Storage Used</span>
            </div>
            {storageLoading ? (
              <div className='text-xs text-gray-500'>Loading...</div>
            ) : (
              <div>
                <div className='text-lg font-bold text-gray-800'>
                  {(storageData as any)?.userStorageInfo?.formattedSize || '0 B'}
                </div>
                <div className='text-xs text-gray-500'>
                  {(storageData as any)?.userStorageInfo?.totalFiles || 0} files
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col flex-1 p-3 space-y-2'>
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
          
          <div className='border-t border-white/30 my-3'></div>
          
          <button 
            onClick={() => setCurrentView('drive')}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-300 ${
              currentView === 'drive' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
          >
            {React.createElement(MdFolder as React.ComponentType<any>, { className: 'text-lg text-blue-600' })}
            My Drive
          </button>
          
          <button 
            onClick={handleAdminAccess}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-300 ${
              currentView === 'admin' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
            }`}
          >
            {React.createElement(MdAdminPanelSettings as React.ComponentType<any>, { className: 'text-lg text-purple-600' })}
            Admin Panel
          </button>
        </div>
        
        {/* User info and logout at bottom */}
        <div className='p-4 border-t border-white/20 mt-auto'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center'>
              {React.createElement(MdPerson as React.ComponentType<any>, { className: 'text-white text-lg' })}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-800 truncate'>
                {storedData.name || 'User'}
              </p>
              <p className='text-xs text-gray-600 truncate'>
                {storedData.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            className='flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200'
          >
            {React.createElement(MdLogout as React.ComponentType<any>, { className: 'text-lg' })}
            Logout
          </button>
        </div>
      </div>
      {showPasswordPrompt && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full mx-4'>
            <div className='text-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                {React.createElement(MdAdminPanelSettings as React.ComponentType<any>, { className: 'text-white text-2xl' })}
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>Admin Access Required</h3>
              <p className='text-gray-600'>Enter the admin password to access the admin panel</p>
            </div>
            
            <div className='space-y-4'>
              <input
                type='password'
                placeholder='Enter admin password'
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className='w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700'
                autoFocus
              />
              
              <div className='flex gap-3'>
                <button
                  onClick={handlePasswordCancel}
                  className='flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium'
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className='flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium'
                >
                  Access Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='flex-1 flex flex-col h-full lg:ml-0'>
        <div className='flex items-center justify-between p-4 lg:p-6 bg-white/80 backdrop-blur-md border-b border-white/30 shadow-sm'>
          <div className='flex items-center gap-4'>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
            <h2 className='text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              {currentView === 'admin' ? 'Admin Panel' : (isSearchActive && searchQuery ? `Search: "${searchQuery}"` : 'My Drive')}
            </h2>
          </div>
          {currentView === 'drive' && (
            <div className='flex items-center gap-2 lg:gap-4 flex-1 lg:flex-none justify-end'>
              <div className='relative flex-1 lg:flex-none max-w-xs lg:max-w-md'>
                <input
                  type='text'
                  placeholder='Search files...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchActive(true)}
                  onBlur={() => setIsSearchActive(false)}
                  className='w-full lg:w-80 pl-10 pr-10 py-2 lg:py-3 bg-white/80 backdrop-blur-md border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-gray-700 placeholder-gray-500 shadow-sm text-sm lg:text-base'
                />
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                  {React.createElement(FaSearch as React.ComponentType<any>, { className: `text-gray-400 transition-colors duration-300 text-sm ${isSearchActive ? 'text-blue-500' : ''}` })}
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                  >
                    {React.createElement(FaTimes as React.ComponentType<any>, { className: 'text-sm' })}
                  </button>
                )}
              </div>
              
              {/* Sort Controls - Hidden on mobile, shown on larger screens */}
              <div className='hidden lg:flex items-center gap-2'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'date')}
                  className='px-4 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-700 text-sm'
                >
                  <option value='date'>Sort by Date</option>
                  <option value='name'>Sort by Name</option>
                  <option value='size'>Sort by Size</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className='px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/90 transition-all duration-200 text-gray-700'
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? 
                    React.createElement(MdKeyboardArrowUp as React.ComponentType<any>, { className: 'text-lg' }) :
                    React.createElement(MdKeyboardArrowDown as React.ComponentType<any>, { className: 'text-lg' })
                  }
                </button>
              </div>
              
              {/* Mobile Sort Button */}
              <div className='lg:hidden'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'date')}
                  className='px-2 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-700 text-xs'
                >
                  <option value='date'>Date</option>
                  <option value='name'>Name</option>
                  <option value='size'>Size</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div 
          className={`flex-1 p-4 lg:p-8 overflow-auto relative ${
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
          
          {currentView === 'admin' ? (
            <AdminPanel isAuthenticated={isAdminAuthenticated} />
          ) : (
            // Drive View
            !loading && !error && (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6'>
              {filteredFiles.length === 0 ? (
                <div className='col-span-full flex flex-col items-center justify-center py-16'>
                  <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
                    {React.createElement(MdFolderOpen as React.ComponentType<any>, { className: 'text-4xl text-gray-400' })}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-600 mb-3'>No files found</h3>
                  <p className='text-gray-500 text-center mb-6'>
                    {searchQuery ? `No files match "${searchQuery}"` : 'Upload your first file to get started'}
                  </p>
                  {!searchQuery && (
                    <div className='flex flex-col items-center'>
                      <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                          isUploading 
                            ? 'text-gray-400 bg-gray-200 cursor-not-allowed' 
                            : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-[1.02]'
                        }`}
                      >
                        {React.createElement(MdUpload as React.ComponentType<any>, { className: 'text-lg' })}
                        {isUploading ? 'Uploading...' : 'Upload Files'}
                      </button>
                      <p className='text-sm text-gray-500 mt-3'>or drag and drop files here</p>
                    </div>
                  )}
                </div>
              ) : (
                filteredFiles.map((file: FileData) => {
                  const { icon: IconComponent, color } = getFileIcon(file.filename);
                  const uploadDate = new Date(file.uploadedAt).toLocaleDateString();
                  
                  // Format file size
                  const formatFileSize = (bytes: number) => {
                    if (bytes === 0) return '0 B';
                    const k = 1024;
                    const sizes = ['B', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
                  };
                  
                  return (
                    <div key={file.id} className='flex flex-col items-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/80 group'>
                      <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        {React.createElement(IconComponent as React.ComponentType<any>, { className: 'text-3xl text-gray-700' })}
                      </div>
                      <h3 className='text-sm font-semibold text-gray-800 text-center mb-2' title={file.filename}>
                        {file.filename.length > 18 ? `${file.filename.substring(0, 18)}...` : file.filename}
                      </h3>
                      <div className='flex flex-col items-center gap-1 mb-3'>
                        <p className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>Uploaded {uploadDate}</p>
                        <p className='text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium'>
                          {formatFileSize((file as any).size || 0)}
                        </p>
                      </div>
                      <div className='flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file.id, file.filename);
                          }}
                          className='flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors duration-200'
                        >
                          {React.createElement(FaDownload as React.ComponentType<any>, { className: 'text-xs' })}
                          Download
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(file.id, file.filename);
                          }}
                          className='flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors duration-200'
                        >
                          {React.createElement(FaShare as React.ComponentType<any>, { className: 'text-xs' })}
                          Share
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file.id, file.filename);
                          }}
                          className='flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors duration-200'
                        >
                          {React.createElement(FaTrash as React.ComponentType<any>, { className: 'text-xs' })}
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            )
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
