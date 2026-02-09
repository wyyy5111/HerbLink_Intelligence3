import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads'

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4()
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueName}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow images only
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    }

    cb(new Error('只允许上传图片文件'))
  },
})

// Upload single file
router.post('/image', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件',
      })
    }

    const fileUrl = `/uploads/${req.file.filename}`

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message,
    })
  }
})

// Upload multiple files
router.post('/images', upload.array('files', 5), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件',
      })
    }

    const uploadedFiles = files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
    }))

    res.json({
      success: true,
      data: uploadedFiles,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message,
    })
  }
})

// Delete file
router.delete('/file/:filename', (req: Request, res: Response) => {
  try {
    const { filename } = req.params
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', filename)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return res.json({
        success: true,
        message: '文件删除成功',
      })
    }

    res.status(404).json({
      success: false,
      message: '文件不存在',
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: '文件删除失败',
      error: error.message,
    })
  }
})

export default router
