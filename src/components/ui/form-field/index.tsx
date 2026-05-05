import { InputMask } from '@react-input/mask'
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form'
import { Field, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  placeholder?: string
  autoComplete?: string
  mask?: string // se não passar, renderiza um Input simples
  type?: string
  onlyNumbers?: boolean
}

export function FormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  autoComplete = 'off',
  mask,
  type,
  onlyNumbers,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
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
            />
          ) : (
            <Input
              {...field}
              id={field.name}
              type={type}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
              onChange={({ target }) => {
                const value = onlyNumbers ? target.value.replace(/\D/g, '') : target.value
                field.onChange(value)
              }}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
