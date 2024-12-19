import { WithDefaultLayout } from '../components/DefautLayout';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CreateEmployee } from '@/components/Employee/CreateEmployee';

const CreatePage: Page = () => {
    return (
        <div>
            <Title>Home</Title>
            <div className='flex items-center'>
                <Link href={'/'}><FontAwesomeIcon icon={faArrowLeft} color='black'></FontAwesomeIcon></Link>
                <h1 className='font-bold text-2xl ml-5'>Create Employee</h1>

            </div>
            <CreateEmployee />
        </div>
    );
}

CreatePage.layout = WithDefaultLayout;
export default CreatePage;
