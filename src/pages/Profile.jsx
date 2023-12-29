import {useState,useEffect} from 'react'
import {toast} from 'react-toastify'
import {getAuth,updateProfile} from 'firebase/auth'
import {updateDoc,doc, setDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useNavigate,Link} from 'react-router-dom'
import homeIcon from '../assets/svg/homeIcon.svg'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'



function Profile() {
  const auth = getAuth()
  const [changeDetails,setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email
  })
  const {name,email} = formData
  const navigate = useNavigate()
  const onLogOut = ()=>{
    auth.signOut()
    navigate('/')
  }
  const onSubmit = async ()=>{
    try {
      if(auth.currentUser.displayName!==name){
        await updateProfile(auth.currentUser,{
          displayName:name
        })

        const userRef = doc(db,'users',auth.currentUser.uid)
        await updateDoc(userRef,{
          name
        })

      }
    } catch (error) {
      toast.error('Could not update profile details !')
    }
  }
  const onChange = (e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value
    }))

  }
  return <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">
        My Profile
      </p>
      <button type='button' className='logOut' onClick={onLogOut}>
        LogOut
      </button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">
          Personal Details
        </p>
        <p className="changePersonalDetails" onClick={()=>{
          setChangeDetails((prevState)=>!prevState)
          changeDetails && onSubmit()
        }}>
          {changeDetails ? 'Done':'Change '}
        </p>
      </div>
      <div className="profileCard">
        <form >
          <input type="text" id='name' className={changeDetails ? "profileNameActive":'profileName'} 
          disabled= {!changeDetails}
          value = {name}
          onChange = {onChange}
          />
          <input type="text" id='email' className={changeDetails ? "profileEmailActive":'profileEmail'} 
          disabled= {!changeDetails}
          value = {email}
          onChange = {onChange}
          />
        </form>
      </div>
      <Link to={'/create-listing'} className = "createListing">
        <img src={homeIcon} alt="homeIcon" />
        <p>Sell or Rent Your Home</p>
        <img src={arrowRight} alt="arrow Right Icon" />

      </Link>
    </main>
  </div>
}

export default Profile