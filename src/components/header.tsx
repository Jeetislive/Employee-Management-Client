
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Header: React.FC = () => {
  return (
    <header>
      <div className='flex justify-between p-2 shadow'>
      <div className='left_holder'>
        <img src='https://www.codelogicx.com/assets/images/logo.svg' width={150} alt="logo" />
      </div>
      <div>
        <ul className='flex space-x-5'>
          <li>
            <a href='#'>
              <AccountCircleIcon />
              Employees
            </a>
          </li>
          <li>
            <a href='#'>
              <AccountBalanceWalletIcon />
              Salary
            </a>
          </li>
          <li>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              CX
            </div>
          </li>
        </ul>
        
      </div>
      </div>
    </header>
  );
}

export default Header;
