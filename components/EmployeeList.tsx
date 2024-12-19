import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import useSWR from 'swr';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { useState } from "react";
import CustomDeleteModal from "./Employee/CustomDeleteModal";
import Link from "next/link";

interface Datas {
    id: string,
    name: string,
}

interface DataItems {
    datas: Datas[]
}

interface DataRow extends Datas {
    rowNumber: number;
    key: React.Key;
}

export const EmployeeList: React.FC = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchDELETE } = useFetchWithAccessToken();
    const { data, isValidating } = useSWR<DataItems>(BackendApiUrl.listEmployee, swrFetcher);

    const columns: ColumnsType<DataRow> = [
        {
            title: <span className='text-base font-semibold'>No</span>,
            dataIndex: "rowNumber",
            key: "rowNumber",
            align: "left",
            width: "60px"
        },
        {
            title: <span className='text-base font-semibold'>Name</span>,
            dataIndex: "name",
            key: "name",
            align: "left",
            width: "300px",
        },
        {
            title: <span className='text-base font-semibold'>Action</span>,
            dataIndex: "action",
            key: "action",
            align: "left",
            width: "30px",
            render: (_, record) => (
                <div className="flex">
                    <Link href={`/${record.id}`}>
                        <button className="bg-[#3788FD] text-white py-2 px-4 rounded  mr-2">
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                    </Link>
                    <button className="bg-[#CC0404] text-white py-2 px-4 rounded" onClick={() => handleDelete(record.id, record.name)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
            ),
        },
    ];

    function dataSource(): DataRow[] {
        if (!data) {
            return [];
        }

        return data.datas.map((item, index) => {
            const row: DataRow = {
                key: item.id,
                rowNumber: index + 1,
                id: item.id,
                name: item.name
            };
            return row;
        })
    }

    const overviewData = dataSource();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState(false);
    const [id, setId] = useState("");
    const [name, setName] = useState("");

    const handleDelete = (id, name) => {
        setId(id);
        setName(name)
        setDeleteModalVisible(true);
    }

    const handleDeleteConfirm = async () => {
        const response = await fetchDELETE(`${BackendApiUrl.deleteEmployee}?Id=${id}`)
        if (response.data) {
            setDeleteModalVisible(false)
            setDeleteSuccessModalVisible(true);
        }
    }

    return (
        <div>
            <hr className='my-[20px]' />
            <Table
                dataSource={overviewData}
                rowClassName="text-base font-normal"
                columns={columns}
                loading={isValidating}
                id="ListTable"
                pagination={{
                    position: ['bottomCenter'],
                    simple: true, defaultCurrent: 1,
                    pageSize: 10
                }}
            />
            <hr className='my-[20px]' />

            {deleteModalVisible &&
                <CustomDeleteModal visible={deleteModalVisible} name={name} id={id} onCancel={() => setDeleteModalVisible(false)} onConfirm={handleDeleteConfirm} />
            }

            {deleteSuccessModalVisible &&
                <Modal
                    title={
                        <div className="w-full border-b border-gray-300 pb-2 text-xl">
                            Delete Success
                        </div>
                    }
                    visible={deleteSuccessModalVisible}
                    onCancel={() => setDeleteSuccessModalVisible(false)}
                    centered
                    footer={false}
                >
                    <div className='px-3 py-5'>
                        <p>Employee <b>{name}</b> successfuly deleted.</p>
                    </div>
                </Modal>
            }
        </div>
    );
}
