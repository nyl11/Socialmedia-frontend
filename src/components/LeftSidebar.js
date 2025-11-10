import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Bi icons (outlined + solid)
import { 
  BiHome, BiSolidHome,
  BiPencil, BiSolidPencil,
  BiUser, BiSolidUser
} from 'react-icons/bi';

const LeftSidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="left-sidebar">
      <div className={`sidebar-item home_btn ${pathname === '/' ? 'active' : ''}`}>
        <Link to="/">
          {pathname === '/' ? <BiSolidHome size={22} /> : <BiHome size={22} />} Home
        </Link>
      </div>

      <div className={`sidebar-item my_post ${pathname === '/createpost' ? 'active' : ''}`}>
        <Link to="/createpost">
          {pathname === '/createpost' ? <BiSolidPencil size={22} /> : <BiPencil size={22} />} Create Post
        </Link>
      </div>

      <div className={`sidebar-item profile ${pathname === '/profile' ? 'active' : ''}`}>
        <Link to="/profile">
          {pathname === '/profile' ? <BiSolidUser size={22} /> : <BiUser size={22} />} Profile
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
