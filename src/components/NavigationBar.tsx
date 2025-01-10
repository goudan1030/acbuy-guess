import React from 'react';

interface NavigationBarProps {
  isDownloadVisible: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isDownloadVisible }) => {
  return (
    <div
      className="w-full" // 背景宽度保持100%
      style={{
        background: '#FF0000',
        boxShadow: '0px 5px 15px 0px rgba(255, 0, 0, 0.35), inset 0px -4px 10px 0px rgba(255, 255, 255, 0.6), inset 0px 4px 10px 0px rgba(255, 255, 255, 0.6)',
      }}
    >
      <div
        className="flex justify-center items-center mx-auto" // 修改为justify-center使内容居中
        style={{
          height: '50px',
          maxWidth: '1200px', // 内容区域宽度限制为1200px
          padding: '0 16px', // 添加左右内边距
        }}
      >
        {/* Logo居中展示 */}
        <a href="/" className="text-white">
          <img src="/svg-menu.svg" alt="Logo" className="h-10" />
        </a>
      </div>
    </div>
  );
};

export default NavigationBar;