import { EmployeeList } from '@/components/EmployeeList';
import { WithDefaultLayout } from '../components/DefautLayout';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import { Button } from 'antd';
import Link from 'next/link';

const IndexPage: Page = () => {
    return (
        <div>
            <Title>Home</Title>
            <div className='flex justify-between'>
                <h1 className='font-bold text-2xl'>Employee List</h1>
                <Link href={'create'}>
                    <Button>Create Employee</Button>
                </Link>
            </div>
            <EmployeeList />
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
