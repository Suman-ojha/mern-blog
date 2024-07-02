import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    
  } from '../redux/user/userSlice';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import { toast } from 'react-toastify';
import 'react-circular-progressbar/dist/styles.css';
const DashProfile = () => {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    }
    useEffect(() => {
        if (imageFile) {

            uploadImage();
        }
    }, [imageFile])

    const uploadImage = () => {
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;//unique image file name
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            //to track each bite and calculate the percentage
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)'
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log(downloadURL,"<<")
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilepic: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    // console.log(formData)
    const handleSubmit = async (e) => {
        // setFormData({...formData ,id: currentUser._id,})
        // console.log(currentUser.user_data._id,'jjs')
        // setFormData({ ...formData, id: currentUser.user_data._id, });
        // formData.id = currentUser._id
        // console.log(formData, "<<data")
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }
        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
            return;
        }
        try {
            dispatch(updateStart);
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' ,
                    'x-access-token': currentUser.token // Include the token here
                },
                body: JSON.stringify({ ...formData, id: currentUser.user_data._id }),
              });
              const data = await res.json();
        
              // setLoading(false);
        
              if (data.status === 'error') {
                // console.log(data.message ,"<<ness")
                // setErrorMessage(data.message);
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message);
                toast.error(data.message)
              }
              if (data.status === 'success') {
                dispatch(updateSuccess(data))
                toast.success(data.message);
                setUpdateUserSuccess(data.message);
               
              }

        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message);
            toast.error(error.message);
        }
    }
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4' >
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div
                    className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                                        })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.user_data.profilepic}
                        alt='user'
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress &&
                            imageFileUploadProgress < 100 &&
                            'opacity-60'
                            }`
                        }
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color='failure'>{imageFileUploadError}</Alert>
                )}

                <TextInput type='text' defaultValue={currentUser.user_data.username} vauleplaceholder='value' id='username' onChange={handleChange} />
                <TextInput type='email' placeholder='email' id='email' defaultValue={currentUser.user_data.email} onChange={handleChange} />
                <TextInput type='passowrd' placeholder='password' id='password' onChange={handleChange} />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <Button outline className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-700 text-white"> Delete Account</Button>
        </div>
    )
}

export default DashProfile