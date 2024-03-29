import {useState,useEffect} from 'react'
import {toast} from 'react-toastify'
import {getAuth,updateProfile} from 'firebase/auth'
import {updateDoc,doc,collection,getDocs,query,where, orderBy,deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useNavigate,Link} from 'react-router-dom'
import homeIcon from '../assets/svg/homeIcon.svg'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import ListingItem from "../components/ListingItem"



function Profile() {
  const auth = getAuth()
  const [changeDetails,setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email
  })
  const {name,email} = formData
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  useEffect(()=>{
    const fetchUserListings = async ()=>{
      const listingRef = collection(db,'listings')
      const q = query(listingRef, where('userRef','==',auth.currentUser.uid),orderBy('timestamp','desc')      )

      const querySnap = await getDocs(q)
      let listings = []
      querySnap.forEach((doc)=>{
        return listings.push({
          id:doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  },[auth.currentUser.uid])


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

  // Onchange
  const onChange = (e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value
    }))

  }

// On Delete
const onDelete = async (listingId) => {
  if (window.confirm('Are you sure you want to delete?')) {
    await deleteDoc(doc(db, 'listings', listingId))
    const updatedListings = listings.filter(
      (listing) => listing.id !== listingId
    )
    setListings(updatedListings)
    toast.success('Successfully deleted listing')
  }
}
// onEdit Function
const onEdit = (listingId)=> navigate(`/edit-listing/${listingId}`)


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
      {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
    </main>
  </div>
}

export default Profile