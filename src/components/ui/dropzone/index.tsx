'use client'

import { Trash2 } from 'lucide-react'
import type { Accept } from 'react-dropzone'
import {
  FileList,
  FileListAction,
  FileListActions,
  FileListDescription,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
  FileListSize,
} from '@/components/ui/file-list'
import {
  DropzoneDescription,
  DropzoneGroup,
  DropzoneInput,
  Dropzone as DropzoneRoot,
  DropzoneTitle,
  DropzoneUploadIcon,
  DropzoneZone,
} from './primitives'

type DropzoneProps = {
  file?: File
  setFile: (file: File | undefined) => void
  accept?: Accept
}

const defaultAccept: Accept = {
  'image/*': ['.jpg', '.png', '.jpeg', '.webp'],
}

export function Dropzone({ file, setFile, accept = defaultAccept }: DropzoneProps) {
  return (
    <DropzoneRoot accept={accept} maxSize={5 * 1024 * 1024} onDropAccepted={files => setFile(files[0])}>
      <div className="flex flex-col gap-4">
        <DropzoneZone>
          <DropzoneInput />
          <DropzoneGroup className="gap-4">
            <DropzoneUploadIcon className="size-6" />
            <DropzoneGroup>
              <DropzoneTitle className="text-sm">Arraste e solte arquivos aqui</DropzoneTitle>
              <DropzoneDescription className="text-xs">
                Você pode enviar arquivos de até 5MB. Formatos suportados: JPG, PNG, JPEG e WEBP.
              </DropzoneDescription>
            </DropzoneGroup>
          </DropzoneGroup>
        </DropzoneZone>

        {file && (
          <FileList>
            <FileListItem>
              <FileListHeader>
                <FileListIcon />
                <FileListInfo>
                  <FileListName>{file.name}</FileListName>
                  <FileListDescription>
                    <FileListSize>{file.size}</FileListSize>
                  </FileListDescription>
                </FileListInfo>
                <FileListActions>
                  <FileListAction onClick={() => setFile(undefined)}>
                    <Trash2 />
                    <span className="sr-only">Remover arquivo</span>
                  </FileListAction>
                </FileListActions>
              </FileListHeader>
            </FileListItem>
          </FileList>
        )}
      </div>
    </DropzoneRoot>
  )
}
