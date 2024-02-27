import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
// import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
// import 'swiper/swiper.min.css'


import Spinner from './Spinner'
// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        // console.log(doc.data().imgUrls[0])
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchListings()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }

  return (
    listings && (
      <>
     


      
        <p className='exploreHeading'>Recommended</p>
    
        <Swiper slidesPerView={1} spaceBetween={50}
        
        
        
        >
          {listings.map(({ data,id }) => (
            <SwiperSlide

              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
          <div
                style={{
                  width:"70vw",
                      // margin:"auto",
                      textAlign:"top"
              }}
                className='swiperSlideDiv'
                
              > <img style={{
                  background:"center no-repeat",
                backgroundSize:"cover",
                width:"100%",
                height:"100%",
                textAlign:"center"

               

              }}  key={id} src={data.imgUrls[0]} alt="" />
                <p id='slideImgText'
                
                
                className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'
                
                id='priceTag'
                >
                  ${data.discountedPrice ?? data.regularPrice}{' '}
                  {data.type === 'rent' && '/ month'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider