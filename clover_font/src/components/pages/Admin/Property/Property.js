import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Import thư viện SweetAlert2
import {
    getAllProperties,
    createProperty,
    updateProperty,
    deleteProperty,
} from '../api/propertyApi';

const PropertyManager = () => {
    const [properties, setProperties] = useState([]);
    const [property, setProperty] = useState({
        id: '',
        name: '',
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();
            setProperties(data);
        } catch (err) {
            setError('Lỗi khi lấy dữ liệu tài sản: ' + err.message);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty({ ...property, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const propertyData = { ...property };
        if (!isEditing) {
            delete propertyData.id;
        }

        try {
            if (isEditing) {
                await updateProperty(property.id, propertyData);
                Swal.fire('Thành công', 'Cập nhật danh mụcthành công!', 'success');
            } else {
                await createProperty(propertyData);
                Swal.fire('Thành công', 'Thêm danh mục mới thành công!', 'success');
            }
            setProperty({ id: '', name: '', description: '' });
            setIsEditing(false);
            setError('');
            fetchProperties();
        } catch (err) {
            setError('Lỗi khi thao tác với danh mục: ' + err.message);
            Swal.fire('Lỗi', 'Có lỗi xảy ra khi thao tác với danh mục!', 'error');
        }
    };

    const handleEdit = (prop) => {
        setProperty(prop);
        setIsEditing(true);
        setError('');
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn sẽ không thể hoàn tác thao tác này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProperty(id);
                    Swal.fire('Đã xóa!', 'danh mục đã được xóa.', 'success');
                    fetchProperties();
                } catch (err) {
                    setError('Lỗi khi xóa danh mục: ' + err.message);
                    Swal.fire('Lỗi', 'Có lỗi xảy ra khi xóa danh mục!', 'error');
                }
            }
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Quản lý danh mục</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card mb-4 shadow-sm p-4">
                <h4 className="text-center">{isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục'}</h4>
                <div className="form-group mt-3">
                    <label htmlFor="name">Tên danh mục</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Nhập tên danh mục"
                        value={property.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        name="description"
                        id="description"
                        className="form-control"
                        placeholder="Nhập mô tả danh mục"
                        value={property.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Cập nhật' : 'Thêm'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => {
                                setProperty({ id: '', name: '', description: '' });
                                setIsEditing(false);
                                setError('');
                            }}
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            <table className="table table-hover table-bordered shadow-sm">
                <thead className="thead-dark">
                    <tr>
                        <th style={{ width: '30%' }}>Tên danh mục</th>
                        <th style={{ width: '50%' }}>Mô tả</th>
                        <th style={{ width: '20%' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.length > 0 ? (
                        properties.map((prop) => (
                            <tr key={prop.id}>
                                <td>{prop.name}</td>
                                <td>{prop.description}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm mr-2"
                                        onClick={() => handleEdit(prop)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(prop.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Không có tài sản nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PropertyManager;
