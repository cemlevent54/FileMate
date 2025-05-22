import React, { useState } from 'react';

interface FileViewerProps {
  filename: string;
  filepath: string;
  mimeType?: string;
  onDocxWidthChange?: (width: number) => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ filename, filepath, mimeType }) => {
  const [pdfError, setPdfError] = useState(false);

  if (!filepath) return <div>Dosya bulunamadı.</div>;
  if (mimeType?.startsWith('image/')) {
    return <img src={filepath} alt={filename} style={{ maxWidth: '100%', maxHeight: 400, display: 'block', margin: '0 auto' }} />;
  }
  if (mimeType === 'application/pdf') {
    return pdfError ? (
      <div style={{ color: 'red' }}>PDF dosyası önizlenemiyor. Lütfen dosyayı yükledikten sonra görüntüleyin.</div>
    ) : (
      <iframe
        src={filepath}
        title={filename}
        width="100%"
        height={500}
        style={{ display: 'block', margin: '0 auto' }}
        onError={() => setPdfError(true)}
      />
    );
  }
  if (mimeType?.startsWith('video/')) {
    return <video src={filepath} controls style={{ maxWidth: '100%', maxHeight: 400, display: 'block', margin: '0 auto' }} />;
  }
  if (mimeType?.startsWith('text/')) {
    return <iframe src={filepath} title={filename} width="100%" height={400} style={{ display: 'block', margin: '0 auto' }} />;
  }
  // docx için sadece indir linki göster
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return <a href={filepath} target="_blank" rel="noopener noreferrer">Dosyayı indir (.docx)</a>;
  }
  
  return <a href={filepath} target="_blank" rel="noopener noreferrer">Dosyayı indir</a>;
};

export default FileViewer; 