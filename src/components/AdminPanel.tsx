import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { 
  MdPeople, 
  MdInsertDriveFile,
  MdImage,
  MdVideoFile,
  MdAudioFile,
  MdPictureAsPdf,
  MdCode,
  MdArchive,
  MdDescription
} from 'react-icons/md';

interface UserData {
  id: string;
  name?: string;
  email: string;
}

interface FileData {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
  size: number;
  user: UserData;
}

interface AllUsersData {
  users: UserData[];
}

interface AllFilesData {
  allFiles: FileData[];
}

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      email
    }
  }
`;

const GET_ALL_FILES = gql`
  query GetAllFiles {
    allFiles {
      id
      filename
      path
      uploadedAt
      size
      user {
        id
        name
        email
      }
    }
  }
`;

const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return { icon: MdPictureAsPdf, color: 'bg-red-100' };
    case 'doc':
    case 'docx':
      return { icon: MdDescription, color: 'bg-blue-100' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return { icon: MdImage, color: 'bg-green-100' };
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'py':
    case 'go':
    case 'java':
    case 'cpp':
    case 'c':
      return { icon: MdCode, color: 'bg-orange-100' };
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
      return { icon: MdArchive, color: 'bg-indigo-100' };
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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

interface AdminPanelProps {
  isAuthenticated: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAuthenticated }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'files'>('users');

  const { data: usersData, loading: usersLoading, error: usersError } = useQuery<AllUsersData>(GET_ALL_USERS, {
    skip: !isAuthenticated,
  });

  const { data: filesData, loading: filesLoading, error: filesError } = useQuery<AllFilesData>(GET_ALL_FILES, {
    skip: !isAuthenticated || activeTab !== 'files',
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='space-y-6 lg:space-y-8'>
      {/* Tab Navigation */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-white/30 pb-6'>
        <div className='flex flex-wrap gap-2 sm:gap-4'>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/60 bg-white/40 backdrop-blur-sm'
            }`}
          >
            <span className='flex items-center gap-2'>
              {React.createElement(MdPeople as React.ComponentType<any>, { className: 'text-lg' })}
              Users ({usersData?.users.length || 0})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
              activeTab === 'files'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/60 bg-white/40 backdrop-blur-sm'
            }`}
          >
            <span className='flex items-center gap-2'>
              {React.createElement(MdInsertDriveFile as React.ComponentType<any>, { className: 'text-lg' })}
              Files ({filesData?.allFiles.length || 0})
            </span>
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className='space-y-4'>
          {usersLoading && (
            <div className='flex flex-col justify-center items-center h-64'>
              <div className='animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4'></div>
              <div className='text-gray-600 font-medium'>Loading users...</div>
            </div>
          )}
          
          {usersError && (
            <div className='flex flex-col justify-center items-center h-64'>
              <div className='text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-200'>
                <p className='font-semibold'>Failed to load users</p>
                <p className='text-sm mt-1'>{usersError.message}</p>
              </div>
            </div>
          )}
          
          {!usersLoading && !usersError && usersData && (
            <div className='grid gap-4 lg:gap-6'>
              {usersData.users.map((user) => (
                <div key={user.id} className='bg-white/80 backdrop-blur-md rounded-xl p-4 lg:p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]'>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    <div className='w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0'>
                      {React.createElement(MdPeople as React.ComponentType<any>, { className: 'text-white text-2xl' })}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-lg lg:text-xl font-bold text-gray-800 mb-1'>
                        {user.name || 'Unnamed User'}
                      </h4>
                      <p className='text-sm lg:text-base text-gray-600 mb-2'>{user.email}</p>
                      <p className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block'>
                        ID: {user.id}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 self-start sm:self-center'>
                      <span className='px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-md'>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className='space-y-4'>
          {filesLoading && (
            <div className='flex flex-col justify-center items-center h-64'>
              <div className='animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4'></div>
              <div className='text-gray-600 font-medium'>Loading files...</div>
            </div>
          )}
          
          {filesError && (
            <div className='flex flex-col justify-center items-center h-64'>
              <div className='text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-200'>
                <p className='font-semibold'>Failed to load files</p>
                <p className='text-sm mt-1'>{filesError.message}</p>
              </div>
            </div>
          )}
          
          {!filesLoading && !filesError && filesData && (
            <div className='space-y-4 lg:space-y-6'>
              {filesData.allFiles.length === 0 ? (
                <div className='text-center py-16'>
                  <div className='w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                    {React.createElement(MdInsertDriveFile as React.ComponentType<any>, { className: 'text-gray-400 text-3xl' })}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-600 mb-2'>No files uploaded yet</h3>
                  <p className='text-gray-500'>Files will appear here once users start uploading</p>
                </div>
              ) : (
                <div className='grid gap-4 lg:gap-6'>
                  {filesData.allFiles.map((file) => {
                    const { icon: IconComponent, color } = getFileIcon(file.filename);
                    const uploadDate = new Date(file.uploadedAt).toLocaleDateString();
                    
                    return (
                      <div key={file.id} className='bg-white/80 backdrop-blur-md rounded-xl p-4 lg:p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                          <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            {React.createElement(IconComponent as React.ComponentType<any>, { className: 'text-2xl text-gray-700' })}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='text-lg lg:text-xl font-bold text-gray-800 mb-2 break-words'>
                              {file.filename}
                            </h4>
                            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3'>
                              <p className='text-sm text-gray-600'>
                                <span className='font-medium'>Uploaded by:</span> {file.user.name || file.user.email}
                              </p>
                              <p className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block'>
                                {uploadDate}
                              </p>
                              <p className='text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full inline-block'>
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 text-xs text-gray-500'>
                              <span className='bg-gray-100 px-2 py-1 rounded-full'>File ID: {file.id}</span>
                              <span className='bg-gray-100 px-2 py-1 rounded-full'>User ID: {file.user.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
