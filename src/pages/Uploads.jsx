import { useState, useEffect } from 'react';

function Uploads() {
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem('uploads');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('uploads', JSON.stringify(files));
    }, [files]);

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
        }));
        setFiles([...files, ...selected]);
    };

    const deleteFile = (index) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
    };

    return (
        <div className="w-full text-left">
            <h1 className="text-2xl font-bold text-green-200 mb-4">Uploads 📁</h1>

            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mb-4 text-green-200 border-2 border-green-200 p-2"
            />

            <ul className="space-y-3">
                {files.map((file, i) => (
                    <li
                        key={i}
                        className="p-4 bg-cyan-950 rounded shadow flex justify-between items-start text-green-200 border-2 border-green-200"
                    >
                        <div>
                            <p className="font-semibold">{file.name}</p>
                            <p className="text-sm text-green-200">
                                {Math.round(file.size / 1024)} KB — {file.type || 'unknown'}
                            </p>
                        </div>
                        <button
                            onClick={() => deleteFile(i)}
                            className="ml-4 text-green-200 text-sm hover:underline hover:text-red-200"
                        >
                            ❌ Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Uploads;