import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai';
import {GoogleAuthProvider , getAuth , signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice'

const Oauth = () => {
    const auth = getAuth(app);
    const navigator = useNavigate();
    const dispath = useDispatch();
    const handleGoogleSubmit = async()=>{
        const provider = new GoogleAuthProvider()
        //to open the pop always
        provider.setCustomParameters({prompt:'select_account'})
        try {
            const resultsFromGoogle = await signInWithPopup(auth , provider)
            // console.log(resultsFromGoogle);
            const res = await fetch(`/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json()
         
            if(data.status == 'success'){
                toast.success(data.message);
                dispath(signInSuccess(data));
                navigator('/');
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleSubmit}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}

export default Oauth