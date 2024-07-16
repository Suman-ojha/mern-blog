import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';

const ForgotPassword = () => {
  const [email, setEmail] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false);
  // const {loading , error : errorMessage} = useSelector(state => state.user );
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setErrorMessage('Please fill the email field.');
    }
    setLoading(true);
    try {
      const res = await fetch('/api/comment/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.token
        },
        body: JSON.stringify({ comment_id: comment._id, content: editedContent, })
      })
    } catch (error) {
      setErrorMessage(error.message);
    }

  }
  // console.log(email, 'sas')

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Suman's
            </span>
            Blog
          </Link>

          <p className='text-2xl mt-5'>
            Reset the Password
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Forget Password'
              )}
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/signin' className='text-blue-500'>
              Signin
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword