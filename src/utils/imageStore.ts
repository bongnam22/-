/**
 * Image storage & optimization utility
 * Handles reading local files, compressing to web-ready data URLs,
 * and storing in IndexedDB to avoid localStorage quota limits.
 */

const DB_NAME = "bom_d_portfolio_images"
const STORE_NAME = "images"
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported"))
      return
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveImageToDB(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    store.put(dataUrl, key)
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn("Could not save to IndexedDB, fallback to in-memory/localStorage", err)
  }
}

export async function getImageFromDB(key: string): Promise<string | null> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(key)
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null
  }
}

/**
 * Optimizes an image file from the user's computer:
 * - Reads file
 * - Scales down to max 1920px (preserving aspect ratio)
 * - Encodes as clean JPEG data URL (~100-300KB instead of 15MB)
 */
export function compressImageFile(file: File, maxDimension = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(e.target?.result as string)
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, width, height)

        // Try WebP or JPEG
        const output = canvas.toDataURL("image/jpeg", quality)
        resolve(output)
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

/**
 * Process multiple files uploaded at once
 */
export async function processMultipleImageFiles(files: FileList | File[]): Promise<string[]> {
  const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"))
  const promises = fileArray.map((file) => compressImageFile(file))
  return Promise.all(promises)
}
