import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { DatePicker, Input, Modal, Select, SelectProps } from "antd";
import dayjs from "dayjs";
import { ConfigProviderProps } from "antd/es/config-provider";
import { useState } from "react";
import useSWR from "swr";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { useRouter } from "next/router";

type SizeType = ConfigProviderProps['componentSize'];

interface CreateEmployee {
    name: string,
    bornDate: Date,
    skills: string[],
}

interface Skill {
    id: number,
    name: string
}

const createEmployeeSchema = z.object({
    name: z.string({ required_error: 'Name cannot be empty' }).min(1, 'Name cannot be empty'),
    bornDate: z.date({ required_error: 'Born date cannot be empty' }),
    skills: z.array(z.string()).nonempty({ message: 'Skills cannot be empty' }),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CreateEmployee: React.FC = () => {
    const { fetchPOST } = useFetchWithAccessToken();
    const [size] = useState<SizeType>('middle');
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [successModal, setSuccessModal] = useState(false);
    const [name, setName] = useState("");
    const router = useRouter();

    const { control, formState: { errors }, handleSubmit, reset, setValue, watch } = useForm<CreateEmployee>({
        resolver: zodResolver(createEmployeeSchema),
    });

    const onSubmit = async (formData: CreateEmployee) => {
        const payload = {
            name: formData.name,
            bornDate: formData.bornDate,
            skills: formData.skills
        }
        
        const response = await fetchPOST<CreateEmployee>(BackendApiUrl.createEmployee, payload);
        if (response.data) {
            setName(payload.name);
            reset();
            setSuccessModal(true)
        }
    }

    const disableDatesAfterToday = (current) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };


    const { data: skillDropdown } = useSWR<Skill[]>(BackendApiUrl.skill, swrFetcher);

    const options: SelectProps["options"] = [];

    if (skillDropdown) {
        options.push(
            ...skillDropdown.map(skill => ({
                value: skill.name,
                label: skill.name,
            }))
        );
    }

    console.log(watch('skills'))
    const onCancel = () => {
        reset();
        setValue('skills', [])
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col">
                <div className="m-10">
                    <div className="mb-5">
                        <label className="font-medium text-xl">Name</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Type Name"
                                    type="text"
                                    {...field}
                                    className="w-full mt-2 p-1 border border-gray-300 rounded"
                                />
                            )}
                        />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="font-medium text-xl">Born Date</label>
                        <Controller
                            name="bornDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => {
                                        field.onChange(date ? date.toDate() : null);
                                    }}
                                    picker="date"
                                    disabledDate={disableDatesAfterToday}
                                    className={`border-1 rounded mt-2.5 p-2 w-full`}
                                />
                            )}
                        />
                        {errors.bornDate && <p className="text-red-500">{errors.bornDate.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="font-medium text-xl">Skills</label>
                        <Controller
                            name="skills"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    mode="tags"
                                    size={size}
                                    placeholder="Please select skills"
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    style={{ width: '100%' }}
                                    options={options}
                                    className="mt-3"
                                />
                            )}
                        />
                        {errors.skills && <p className="text-red-500">{errors.skills.message}</p>}
                    </div>

                    <div className="flex justify-end mt-96">
                        <button className="bg-red-500 text-white px-5 py-3 rounded-lg w-36 hover:bg-red-300 mr-5" onClick={onCancel}>Reset</button>
                        <button type="submit" className="bg-[#3788FD] text-white px-5 py-3 w-36 rounded-lg hover:bg-blue-400">Save</button>
                    </div>
                </div>
            </form>

            {successModal && <>
                <Modal
                    title={
                        <div className="w-full border-b border-gray-300 pb-2 text-xl">
                            Confirmation
                        </div>
                    }
                    visible={successModal}
                    onCancel={() => router.back()}
                    centered
                    footer={false}
                >
                    <div className='px-3 py-5'>
                        <p>Success Created Employee {name}</p>
                    </div>
                </Modal>
            </>}
        </div>
    );
}