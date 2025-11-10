import './PostForm.css';
import { useState } from 'react'
import { usePostsContext } from "../hooks/usePostsContext"
import { useAuthContext } from '../hooks/useAuthContext'
import { FaCamera } from "react-icons/fa";

const PostForm = () => {
  const { dispatch } = usePostsContext()
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null) 
  const [imagePreview, setImagePreview] = useState(null) 
  const [url, setUrl] = useState('')
  const [votes, setVotes] = useState('')
  const [commentsCount, setCommentsCount] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false) 

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  const removeImage = () => {
    setImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('url', url)
    formData.append('votes', votes || '0')
    formData.append('commentsCount', commentsCount || '0')
    if (image) formData.append('image', image)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Failed to create post')

      setTitle('')
      setContent('')
      setImage(null)
      setImagePreview(null)
      setUrl('')
      setVotes('')
      setCommentsCount('')
      setError(null)
      dispatch({ type: 'CREATE_POST', payload: json })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Create a Post</h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <div className="image-upload">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        
        {!image ? (
          <button
            type="button"
            onClick={() => document.getElementById('image-upload').click()}
            className="add-image-btn"
          >
            <FaCamera style={{ marginRight: "6px" }} /> Add Image
          </button>
        ) : (
          <div className="image-preview-container">
            <div className="image-preview" style={{ position: 'relative', display: 'inline-block', maxWidth: '200px' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover', display: 'block', width: '100%' }} 
              />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#333',
                  border: '1px solid #ccc',
                  borderRadius: '20%',
                  width: '28px', /* ✅ fixed size */
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}
      </div>

      <div className='action'>
        <button 
          type="submit" 
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
      
      {error && <div className='error'>{error}</div>}
    </form>
  )
}

export default PostForm
