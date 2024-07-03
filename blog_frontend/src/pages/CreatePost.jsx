import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const CreatePost = () => {
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className="text-3xl font-semibold my-7 text-center">Create  A Post</h1>
            <form className='flex flex-col gap-4'>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type='text'
                        placeholder='title'
                        id='title'
                        className='flex-1'
                        required
                    />
                    <Select>
                        <option value="uncategorized">select a category</option>
                        <option value="javascript">Javascript</option>
                        <option value="python">Python</option>
                        <option value="reactjs">React.js</option>
                        <option value="nodejs">Node.js</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted p-3">
                    <FileInput type='file' accept='image/*' />
                    <Button 
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                    >Upload Image</Button>
                </div>
                <ReactQuill theme='snow' placeholder='write something' className='h-72 mb-12' required/>
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>Publish</Button>
            </form>

        </div>
    )
}

export default CreatePost