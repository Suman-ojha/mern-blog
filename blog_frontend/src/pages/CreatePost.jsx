import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';


const CreatePost = () => {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [file, setFile] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelUploadImage = async () => {
        setImageFileUploading(true);
        try {
            if (!file) {
                setImageFileUploadError('Please Select an image')
                return;
            }
            setImageFileUploadError(null);//after error...refresh to initaial state
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
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
                    setImageFileUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // console.log(downloadURL,"<<")
                        setImageFileUrl(downloadURL)
                        setImageFileUploadProgress(null);
                        setImageFileUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                        setImageFileUploading(false);
                    });
                }
            );
        } catch (error) {
            setImageFileUploadError('Image upload failed!')
            setImageFileUploadProgress(null);
            console.log(error);
        }
    }

    const handleChange = async (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const haldelSubmitPost = async (e) => {
        e.preventDefault();
        console.log('form submit..');
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': currentUser.token // Include the token here
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            // console.log(data, "<<data")
            if (data.status === 'error') {
                setPublishError(data.message);
                toast.error(data.message)
                return;
            }

            if (data.status === 'success') {
                toast.success(data.message)
                setPublishError(null);
                navigate(`/post/${data.data.slug}`);
            }
        } catch (error) {
            toast.error(error.message)
            setPublishError(error.message)
        }
    }
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className="text-3xl font-semibold my-7 text-center">Create  A Post</h1>
            <form className='flex flex-col gap-4' onSubmit={haldelSubmitPost}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type='text'
                        placeholder='title'
                        id='title'
                        className='flex-1'
                        onChange={handleChange}
                        required
                    />
                    <Select id='category' onChange={handleChange}>
                        <option value="uncategorized">select a category</option>
                        <option value="javascript">Javascript</option>
                        <option value="python">Python</option>
                        <option value="reactjs">React.js</option>
                        <option value="nodejs">Node.js</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted p-3">
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                        onClick={handelUploadImage}
                        disabled={imageFileUrl}
                    >
                        Upload Image
                    </Button>
                </div>
                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload-image-for-post'
                        className='w-full h-70 object-cover'
                    /> 
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='write your note...'
                    className='h-72 mb-12'
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                    required
                />
                <Button
                    type='submit'
                    gradientDuoTone='purpleToBlue'
                    outline
                    disabled={loading || imageFileUploading}
                >
                    {imageFileUploading ? 'Loading...' : "Publish"}
                </Button>

                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}
            </form>

        </div>
    )
}

export default CreatePost