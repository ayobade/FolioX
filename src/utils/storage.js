export const saveToLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data))
export const getFromLocal = (key) => {
    const v = localStorage.getItem(key)
    if (!v) return null
    try { return JSON.parse(v) } catch { return null }
}
export const removeFromLocal = (key) => localStorage.removeItem(key)

