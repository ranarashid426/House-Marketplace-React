import {Navigate,Outlet} from 'react-router-dom'
import {useOffStatus} from '../hooks/useOffStatus'
import Spinner from './Spinner'
const PrivateRoute = () => {
    const {loggedIn,checkingStatus} = useOffStatus()
    if (checkingStatus) {
      
        return <Spinner/>
    }
    
  return loggedIn ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default PrivateRoute