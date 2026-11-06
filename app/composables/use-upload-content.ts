import type { MatrixError, UploadOpts, UploadProgress, UploadResponse } from 'matrix-js-sdk'

export function useUploadContent() {
  const { client } = useMatrixClient()
  const { mediaConfig } = useMediaConfig()
  const progress = ref<UploadProgress>()
  const abortController = shallowRef<AbortController>()

  const uploadContentMutation = useMutation({
    mutationFn: async (params: Omit<UploadOpts, 'progressHandler'> & { file: UploadContentFile }) => {
      const { file, ...opts } = params ?? {}

      if (file.size > mediaConfig.value?.['m.upload.size']) throw new FileTooLargeError()

      abortController.value = opts.abortController ?? new AbortController()

      const [err, res] = await attemptAsync<UploadResponse, MatrixError>(() =>
        uploadContent(client.value, file!, {
          ...opts,
          abortController: abortController.value,
          progressHandler: p => (progress.value = p),
        }),
      )

      progress.value = undefined
      abortController.value = undefined

      if (err) throw err
      return res
    },
    mutationKey: $mk.uploadContent(),
  })

  return {
    progress,
    uploadContent: { ...uploadContentMutation, abort: () => abortController.value?.abort() },
  }
}
