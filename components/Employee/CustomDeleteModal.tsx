import React from 'react';
import { Modal } from 'antd';

const CustomDeleteModal = ({ visible, name, id, onCancel, onConfirm }) => {
    return (
        <Modal
            open={visible}
            title={
                <div className="w-full border-b border-gray-300 pb-2 text-xl font-medium">
                Confirmation
                </div>
            }
            centered
            onCancel={onCancel}
            footer={
                <div className="border-t border-gray-300 pt-2 text-base font-semibold ">
                    <button key="delete" color='#CC0404' onClick={() => onConfirm(name, id)} className='bg-[#CC0404] text-white px-4 py-2 rounded-lg'>
                        Delete
                    </button>
                </div>
            }
        >
            <p className='px-3 py-5 text-base font-normal'>Are you sure want to delete employee <b>{name}</b> ?</p>
        </Modal>
    );
};

export default CustomDeleteModal;
