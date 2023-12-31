import {useState} from 'react'
import {toast} from 'react-toastify'
import {Link,useNavigate} from 'react-router-dom'
import {getAuth,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import {doc,setDoc,serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth'

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      name:'',
      email:'',
      password:''
    })
    const {name,email,password} = formData
    const navigate = useNavigate()
    const onChange = (e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value 
        }))
    }

    const onSubmit = async(e)=>{
      e.preventDefault()
      try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth,email,password)
        const user = userCredential.user
        updateProfile(auth.currentUser,{
          displayName:name
        })
        const formDataCopy = {...formData}
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()
        await setDoc(doc(db,'users',user.uid,),formDataCopy)

        navigate('/')
      } catch (error) {
        toast.error('Something went wrong with Registration')
        console.log(error)
      }
    }


  return (
    <>
    <div className="pageContainer">
        <header>
            <p className="pageHeader">
                Welcome Back!
            </p>
        </header>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder='Name' id='name' value={name} className="nameInput" onChange={onChange}  />
                <input type="email" placeholder='Email' id='email' value={email} className="emailInput" onChange={onChange}  />
                <div className="passwordInputDiv">
                    <input type={showPassword ? 'text':'password' }  className="passwordInput" placeholder='Password' id='password' value={password } onChange={onChange}
                    />
                    <img className='showPassword' src={visibilityIcon} alt="Show Password" onClick={()=>setShowPassword((prevState)=>!prevState)} />
                </div>
                <Link to='/forgot-password' className='forgotPasswordLink'>
                  Forgot Password  
                </Link>
                <div className="signUpBar">
                    <p className="signUpText">
                        SignUp
                    </p>
                    <button className="signUpButton">
                        <ArrowRightIcon fill='#fff' width='34px' height='34px'/>
                    </button>

                </div>
            </form>
            {/* GOOGLEOATH */}
            <OAuth/>
            <Link to='/sign-in' className='registerLink'>
                  Sign In Instead  
            </Link>
           
    </div>
    </>
  )
}

export default SignUp