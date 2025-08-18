import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";

interface InputPriceProps {
    name: string;
    errors: string|null|undefined;
    label: string;
    value?: string;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    containerClassName?: string;
    currencySymbol?: string;
    onChange?: (value: string, rawValue: string) => void;
    onBlur?: (value: string, rawValue: string) => void;
    disabled?: boolean;
    required?: boolean;
}

export default function InputPrice({ 
    name, 
    label,
    errors,
    value = "",
    placeholder = "0",
    className = "",
    labelClassName = "",
    containerClassName = "",
    currencySymbol = "Rp. ",
    onChange,
    onBlur,
    disabled = false,
    required = false
}: InputPriceProps) {
    const [internalValue, setInternalValue] = useState("");

    // Sync with external value prop
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(formatRupiah(value));
        }
    }, [value]);

    const formatRupiah = (number: string) => {
        const cleanNumber = number.replace(/\D/g, '');
        return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const getRawValue = (formattedValue: string) => {
        return formattedValue.replace(/\D/g, '');
    };

    const handleOnChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = formatRupiah(inputValue);
        const rawValue = getRawValue(formattedValue);
        
        setInternalValue(formattedValue);
        
        // Call external onChange if provided
        if (onChange) {
            onChange(formattedValue, rawValue);
        }
    };

    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const rawValue = getRawValue(internalValue);
        
        // Call external onBlur if provided
        if (onBlur) {
            onBlur(internalValue, rawValue);
        }
    };

    return (
        <div className={containerClassName}>
            <Label className={`block text-sm/6 font-medium text-white ${labelClassName}`}>
                {label} {required && <span className="text-red-400">*</span>}
            </Label>
            <div className={cn(`flex items-center rounded-md pl-3 outline-1 -outline-offset-1 ${errors ? 'outline-danger':'outline-teal-500'}`,)}>
                <div className="shrink-0 select-none text-lg font-semibold text-gray-300 px-1">
                    {currencySymbol}
                </div>
                <Input 
                    style={styles} 
                    type="text" 
                    name={name} 
                    value={internalValue}
                    onChange={handleOnChangePrice}
                    onBlur={handleOnBlur}
                    className={`text-2xl font-bold text-end ${className}`}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                />
            </div>
            {errors && (
                <span className="text-red-500">{errors}</span>
            )}
        </div>
    );
}

const styles = {
    outline: 'none',
    boxShadow: 'none',
    border: 'none'
};

// Example usage:
/*
// Basic usage
<InputPrice 
    name="price" 
    label="Product Price" 
    onChange={(formatted, raw) => {
        console.log('Formatted:', formatted); // "1.000.000"
        console.log('Raw:', raw); // "1000000"
    }}
/>

// With controlled value
<InputPrice 
    name="budget" 
    label="Budget" 
    value={budgetValue}
    onChange={(formatted, raw) => setBudgetValue(raw)}
    placeholder="Enter your budget"
    required
/>

// Custom styling
<InputPrice 
    name="salary" 
    label="Monthly Salary" 
    className="text-green-500"
    labelClassName="text-green-200"
    containerClassName="mb-4"
    currencySymbol="IDR "
    onChange={(formatted, raw) => handleSalaryChange(raw)}
/>

// With onBlur event
<InputPrice 
    name="total" 
    label="Total Amount" 
    onChange={(formatted, raw) => setTotal(raw)}
    onBlur={(formatted, raw) => {
        console.log('User finished editing:', raw);
        // Validate, save to API, etc.
    }}
/>
*/