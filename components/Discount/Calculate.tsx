import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { Input, Select } from "antd";
import { ConfigProviderProps } from "antd/es/config-provider";
import { useState } from "react";

type SizeType = ConfigProviderProps['componentSize'];

interface Transaction {
    typeCustomer: string;
    point: number;
    totalGrocery: number;
}

const createTransactionSchema = z.object({
    typeCustomer: z.string({ required_error: 'Type Customer cannot be empty' }).min(1, 'Type Customer cannot be empty'),
    point: z.number({ required_error: 'Point cannot be empty' }).min(100, 'Point Must be bigger than 100'),
    totalGrocery: z.number({ required_error: 'Born date cannot be empty' }).min(1, 'Grocery Cannot be empty'),
})

export const Calculate: React.FC = () => {
    const { fetchPOST } = useFetchWithAccessToken();
    const [size] = useState<SizeType>('middle');

    const { control, formState: { errors }, handleSubmit, reset } = useForm<Transaction>({
        resolver: zodResolver(createTransactionSchema),
    });

    const onSubmit = async (formData: Transaction) => {
        const payload = {
            typeCustomer: formData.typeCustomer,
            point: formData.point,
            totalGrocery: formData.totalGrocery,
        }

        const response = await fetchPOST<Transaction>(BackendApiUrl.createTransaction, payload);
        if (response.data) {
            reset();
        }
    }

    const [options] = useState([
        { value: 'platinum', label: 'Platinum' },
        { value: 'gold', label: 'Gold' },
        { value: 'silver', label: 'Silver' },
    ]);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col">
                <div className="m-10">
                    <div className="mb-5">
                        <label className="font-medium text-xl">Type Customer</label>
                        <Controller
                            name="typeCustomer"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
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
                        {errors.typeCustomer && <p className="text-red-500">{errors.typeCustomer.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="font-medium text-xl">Point Reward</label>
                        <Controller
                            name="point"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Point"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="w-full mt-2 p-1 border border-gray-300 rounded"
                                />
                            )}
                        />
                        {errors.point && <p className="text-red-500">{errors.point.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="font-medium text-xl">Total Grocery</label>
                        <Controller
                            name="totalGrocery"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Total Grocery"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="w-full mt-2 p-1 border border-gray-300 rounded"
                                />
                            )}
                        />
                        {errors.totalGrocery && <p className="text-red-500">{errors.totalGrocery.message}</p>}
                    </div>

                    <div className="flex justify-end mt-96">
                        <button type="submit" className="bg-[#3788FD] text-white px-5 py-3 w-36 rounded-lg hover:bg-blue-400">Save</button>
                    </div>
                </div>
            </form>

        </div>
    );
}