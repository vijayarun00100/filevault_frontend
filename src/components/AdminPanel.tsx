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
    <div className='space-y-6'>
      {/* Tab Navigation */}
      <div className='flex items-center gap-4 border-b border-white/20 pb-4'>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            activeTab === 'users'
              ? 'bg-purple-100 text-purple-700 shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Users ({usersData?.users.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            activeTab === 'files'
              ? 'bg-purple-100 text-purple-700 shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Files ({filesData?.allFiles.length || 0})
        </button>
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
            <div className='grid gap-4'>
              {usersData.users.map((user) => (
                <div key={user.id} className='bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center'>
                      {React.createElement(MdPeople as React.ComponentType<any>, { className: 'text-white text-xl' })}
                    </div>
                    <div className='flex-1'>
                      <h4 className='text-lg font-semibold text-gray-800'>
                        {user.name || 'Unnamed User'}
                      </h4>
                      <p className='text-sm text-gray-600'>{user.email}</p>
                      <p className='text-xs text-gray-500 mt-1'>User ID: {user.id}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
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
            <div className='space-y-3'>
              {filesData.allFiles.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    {React.createElement(MdInsertDriveFile as React.ComponentType<any>, { className: 'text-gray-400 text-2xl' })}
                  </div>
                  <p className='text-gray-500'>No files uploaded yet</p>
                </div>
              ) : (
                filesData.allFiles.map((file) => {
                  const { icon: IconComponent, color } = getFileIcon(file.filename);
                  const uploadDate = new Date(file.uploadedAt).toLocaleDateString();
                  
                  return (
                    <div key={file.id} className='bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300'>
                      <div className='flex items-center gap-4'>
                        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                          {React.createElement(IconComponent as React.ComponentType<any>, { className: 'text-2xl text-gray-700' })}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='text-lg font-semibold text-gray-800 truncate'>
                            {file.filename}
                          </h4>
                          <div className='flex items-center gap-4 mt-1'>
                            <p className='text-sm text-gray-600'>
                              Uploaded by: <span className='font-medium'>{file.user.name || file.user.email}</span>
                            </p>
                            <p className='text-sm text-gray-500'>
                              {uploadDate}
                            </p>
                            <p className='text-sm text-blue-600 font-medium'>
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <p className='text-xs text-gray-500 mt-1'>
                            File ID: {file.id} | User ID: {file.user.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
