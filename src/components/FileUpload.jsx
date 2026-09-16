import { useRef, useState } from 'react';
import { UploadCloud, FileText, X, FileCheck, Sparkles } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

export default function FileUpload({ file, onFileSelect, onRemove, onSelectSample }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList) => {
    const picked = fileList?.[0];
    if (!picked) return;
    if (picked.type !== 'application/pdf' && !picked.name.endsWith('.pdf')) {
      alert('Please select a PDF document.');
      return;
    }
    onFileSelect(picked);
  };

  if (file) {
    return (
      <div className="card card-pad" style={{ background: '#f0fdf4', borderColor: '#a7f3d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="stat-icon-wrapper stat-icon-emerald">
              <FileCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f5247' }}>{file.name}</div>
              <div style={{ fontSize: '12.5px', color: '#0d9488', marginTop: '2px' }}>
                {formatFileSize(file.size || 245000)} • PDF Clinical Document Ready
              </div>
            </div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ borderColor: '#fecaca', color: '#ef4444' }} 
            onClick={onRemove}
          >
            <X size={15} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone-wrapper ${dragActive ? 'dragover' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <div className="upload-icon-circle">
        <UploadCloud size={32} />
      </div>
      <div className="upload-title">Upload Clinical Discharge Summary</div>
      <div className="upload-desc">
        Drag and drop patient PDF notes, or click to browse local files. AI will automatically translate and simplify instructions.
      </div>
      <button 
        className="btn btn-primary" 
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
      >
        <FileText size={16} />
        <span>Browse PDF File</span>
      </button>

      {onSelectSample && (
        <div className="sample-loader-box" onClick={(e) => e.stopPropagation()}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Or load demo notes:</span>
          <button className="sample-chip" onClick={() => onSelectSample('cardiology')}>
            <Sparkles size={13} />
            <span>Cardiology Discharge</span>
          </button>
          <button className="sample-chip" onClick={() => onSelectSample('orthopedic')}>
            <Sparkles size={13} />
            <span>Orthopedic Surgery</span>
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
