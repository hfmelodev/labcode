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
}

export function FormField<T extends FieldValues>({ control, name, placeholder, autoComplete = 'off', mask }: FormFieldProps<T>) {
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
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
            />
          ) : (
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
