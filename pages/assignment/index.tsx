import { Calculate } from '@/components/Discount/Calculate';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Title } from '../../components/Title';
import { Page } from '../../types/Page';

const IndexPage: Page = () => {
    return (
        <div>
            <Title>Assignment</Title>
            <div>
                <h1 className='font-bold text-2xl'>Calculate Discount</h1>
                <Calculate />
            </div>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
