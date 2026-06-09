import { describe, expect, it } from 'vitest'

describe('messaging', () => {
  it('prevents XSS attacks', async () => {
    expect(sanitizeFormattedBody(`<script>alert('hi')</script> hi`)).toMatchInlineSnapshot(`" hi"`)
  })

  it('strips disallowed attributes from unrestricted tags', async () => {
    expect(sanitizeFormattedBody(`<p width="100" data-mx-invalid height="200">hi</p>`)).toMatchInlineSnapshot(
      `"<p>hi</p>"`,
    )
  })

  it('strips disallowed attributes from `p` tags', async () => {
    expect(sanitizeFormattedBody(`<p width="100" data-mx-invalid height="200">hi</p>`)).toMatchInlineSnapshot(
      `"<p>hi</p>"`,
    )
  })

  it('correctly processes `code` tags', async () => {
    expect(
      sanitizeFormattedBody(`<code width="100" data-mx-invalid class="language-rust underline">hi</code>`),
    ).toMatchInlineSnapshot(`"<code class="language-rust">hi</code>"`)
  })

  it('correctly processes `span` tags', async () => {
    expect(sanitizeFormattedBody(`<span width="100" class="hi" data-mx-invalid>hi</span>`)).toMatchInlineSnapshot(
      `"<span>hi</span>"`,
    )
  })

  it('correctly processes `a` tags', async () => {
    expect(
      sanitizeFormattedBody(
        `<a width="100" class="hi" data-mx-invalid target="_blank" href="https://matrix.to">hi</a>`,
      ),
    ).toMatchInlineSnapshot(`"<a target="_blank" href="https://matrix.to">hi</a>"`)
  })

  it('correctly processes `img` tags', async () => {
    expect(
      sanitizeFormattedBody(
        `<img width="100" wadth="hi" class="hi" data-mx-invalid alt="my cool image" src="mxc://matrix.org/my-cool-image">hi</img>`,
      ),
    ).toMatchInlineSnapshot(`"<img width="100" alt="my cool image" src="mxc://matrix.org/my-cool-image">hi"`)

    expect(
      sanitizeFormattedBody(
        `<img width="100" data-mx-invalid alt="my bad image" src="https://matrix.org/my-bad-image">hi</img>`,
      ),
    ).toMatchInlineSnapshot(`"<img width="100" alt="my bad image">hi"`)
  })
})
