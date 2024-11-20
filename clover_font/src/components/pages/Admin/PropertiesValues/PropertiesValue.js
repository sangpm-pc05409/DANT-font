import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    getAllPropertiesValues,
    createPropertyValue,
    updatePropertyValue,
    deletePropertyValue,
    getPropertyValueById,
} from '../api/propertiesValueApi';
import { getAllProperties } from '../api/propertyApi';  // Import API lấy danh mục

const PropertyValueManager = () => {
    const [propertiesValues, setPropertiesValues] = useState([]); // Danh sách PropertiesValue
    const [properties, setProperties] = useState([]); // Danh sách Properties (Danh mục)
    const [propertyValue, setPropertyValue] = useState({
        id: '',
        name: '',
        description: '',
        propertyId: ''
    }); // Dữ liệu PropertiesValue hiện tại
    const [isEditing, setIsEditing] = useState(false); // Kiểm tra trạng thái chỉnh sửa
    const [error, setError] = useState(''); // Lỗi nếu có

    // Lấy tất cả Properties
    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();  // Gọi API lấy danh mục
            setProperties(data);
        } catch (err) {
            setError('Lỗi khi lấy danh mục: ' + err.message);
        }
    };

    // Lấy tất cả PropertiesValue
    const fetchPropertiesValues = async () => {
        try {
            const data = await getAllPropertiesValues();
            setPropertiesValues(data);
        } catch (err) {
            setError('Lỗi khi lấy dữ liệu: ' + err.message);
        }
    };

    useEffect(() => {
        fetchProperties();  // Lấy danh mục khi component mount
        fetchPropertiesValues(); // Lấy PropertiesValue
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyValue({ ...propertyValue, [name]: value });
    };

    // Xử lý khi gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const propertyValueData = { ...propertyValue };

        if (!isEditing) {
            delete propertyValueData.id;
        }

        try {
            if (isEditing) {
                await updatePropertyValue(propertyValue.id, propertyValueData);
                Swal.fire('Thành công!', 'Cập nhật thành công', 'success');
            } else {
                await createPropertyValue(propertyValueData);
                Swal.fire('Thành công!', 'Tạo mới thành công', 'success');
            }
            setPropertyValue({ id: '', name: '', description: '', propertyId: '' });
            setIsEditing(false);
            setError('');
            fetchPropertiesValues(); // Cập nhật lại danh sách
        } catch (err) {
            setError('Lỗi khi thao tác: ' + err.message);
        }
    };

    // Chỉnh sửa PropertiesValue
    const handleEdit = (propValue) => {
        setPropertyValue(propValue);
        setIsEditing(true);
        setError('');
    };

    // Xóa PropertiesValue với xác nhận Swal
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: 'Bạn có chắc chắn muốn xóa mục này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                await deletePropertyValue(id);
                Swal.fire('Đã xóa!', 'Xóa thành công', 'success');
                fetchPropertiesValues();
            } catch (err) {
                setError('Lỗi khi xóa: ' + err.message);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Quản lý thuộc tính</h1>

            {/* Hiển thị lỗi nếu có */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Form Thêm/Sửa PropertiesValue */}
            <form onSubmit={handleSubmit} className="card mb-4 shadow-sm p-4">
                <h4 className="text-center">{isEditing ? 'Cập nhật' : 'Thêm mới'}</h4>
                <div className="form-group mt-3">
                    <label htmlFor="name">Tên</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Nhập tên"
                        value={propertyValue.name}
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
                        placeholder="Nhập mô tả"
                        value={propertyValue.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                {/* Dropdown để chọn danh mục */}
                <div className="form-group mt-3">
                    <label htmlFor="propertyId">Danh mục</label>
                    <select
                        name="propertyId"
                        id="propertyId"
                        className="form-control"
                        value={propertyValue.propertyId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn danh mục</option>
                        {properties.map((prop) => (
                            <option key={prop.id} value={prop.id}>
                                {prop.name} {/* Hiển thị tên danh mục */}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => {
                                setPropertyValue({ id: '', name: '', description: '', propertyId: '' });
                                setIsEditing(false);
                                setError('');
                            }}
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {/* Bảng danh sách PropertiesValue */}
            <table className="table table-hover table-bordered shadow-sm">
                <thead className="thead-dark">
                    <tr>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Danh mục</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {propertiesValues.length > 0 ? (
                        propertiesValues.map((propValue) => (
                            <tr key={propValue.id}>
                                <td>{propValue.name}</td>
                                <td>{propValue.description}</td>
                                <td>{propValue.properties?.name}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm mr-2"
                                        onClick={() => handleEdit(propValue)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(propValue.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PropertyValueManager;
