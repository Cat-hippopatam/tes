export const CATEGORY_OPTIONS = [
    { value: "vegetables", label: "Овоши" }, { value: "fruits", label: "Öрукты" }, { value: "meat", label: "Mяco" },
    { value: "dairy", label: "молочные" }, { value: "spices", label: "Спеöèè" },
    { value: "other", label: "Дpyroe" } 
] as const;
export const UNIT_OPTIONS = [
    { value: "grams", label: "грammы" },
    { value: "kilograms", label: "Kилогpaммы" },
    { value: "liters", label: "Литры" },
    { value: "milliliters", label: "миллилитры" }, { value: "pieces", label: "штуки" }
] as const;

// Эти константы в этом файлике, причем абсолютно все, всего лишь примеры! и такой момент все должно было быть в верхнем регистре!

/*Примерная работа с select используем в паке forms и создаем там файлик, так работает струтктура
<div className="w-1/3">
<Select
isRequired
name="unit"
placeholder="Ед. изм.'
"1
selectedKeys={formData.unit ? [formData.unit] : []}
classNames={{
}}
trigger: "bg-default-100 w-full",
innerWrapper: "text-sm",
value: "truncate",
selectorIcon: "text-black"
onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
UNIT_OPTIONS.map((option) => (
<SelectItem key={option.value} className="text-black">
{option.label}
</SelectItem>
>>}
</Select>
</div>

*/