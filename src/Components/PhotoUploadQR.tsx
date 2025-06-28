import QRCode from 'react-qr-code';

const uploadUrl = "https://d5eaa21b-8e31-4386-9622-c0ec4f4aeae7.netlify.app";

const PhotoUploadQR = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-emerald-500 rounded-xl shadow-md w-160px h-160px object-contain flex flex-col justify-center items-center space-y-3 text-center">
       
        <div className="bg-white p-2 rounded">
          <QRCode value={uploadUrl} size={180} />
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadQR;
