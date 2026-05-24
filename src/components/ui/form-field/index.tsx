import { InputMask } from '@react-input/mask'
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  placeholder?: string
  label?: string
  autoComplete?: string
  mask?: string // se não passar, renderiza um Input simples
  type?: string
  onlyNumbers?: boolean
  valueAsNumber?: boolean
  className?: string
}

export function FormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  autoComplete = 'off',
  mask,
  type,
  onlyNumbers,
  valueAsNumber,
  className,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
          {mask ? (
            <InputMask
              mask={mask}
              replacement={{ _: /\d/ }}
              component={Input}
              {...field}
              id={field.name}
              type={type}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className="placeholder:text-sm"
            />
          ) : (
            <Input
              {...field}
              id={field.name}
              type={type}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={`${className} placeholder:text-sm`}
              onChange={({ target }) => {
                const stripped = onlyNumbers ? target.value.replace(/\D/g, '') : target.value
                field.onChange(valueAsNumber ? Number(stripped) : stripped)
              }}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
