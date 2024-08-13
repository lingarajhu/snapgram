import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { useUserContext } from "@/context/AuthContext";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const ProfilePhotoUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const { user: currentUser } = useUserContext();

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-cente text-center rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 lg:flex-row flex-col justify-start gap-6 items-center">
            <img
              src={fileUrl}
              alt="uploaded Image"
              className="lg:w-40 lg:h-40 w-28 h-28 rounded-full object-cover object-top"
            />
            <p onClick={open} className="text-primary-600 lg:h3-bold text-lg">
              Change Profile Photo
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-1 lg:flex-row flex-col justify-start gap-6 items-center">
          <img
            src={currentUser?.imageUrl}
            className="lg:w-40 lg:h-40 w-28 h-28 object-cover object-top rounded-full"
            alt="upload"
          />
          <p onClick={open} className="text-primary-600 lg:h3-bold text-lg">
            Change Profile Photo
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUploader;
