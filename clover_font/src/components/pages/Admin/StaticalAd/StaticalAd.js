import React, { useEffect, useState } from 'react';
import { getAllStaticalAds } from '../api/stacticialAdApi'; // Import hàm API đã viết
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const StaticalAd = () => {
    const [staticalAds, setStaticalAds] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Trạng thái loading

    // Trạng thái cho các trường nhập liệu
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nameShop, setShopId] = useState('');

    // Thêm trạng thái lỗi cho ngày
    const [dateError, setDateError] = useState('');

    // Trạng thái cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Số lượng items trên mỗi trang

    // Hàm gọi API để lấy dữ liệu với các tham số lọc
    const fetchStaticalAds = async (filterStartDate, filterEndDate, filterShopId) => {
        setLoading(true); // Bắt đầu quá trình loading
        try {
            const data = await getAllStaticalAds(filterStartDate, filterEndDate, filterShopId);
            setStaticalAds(data); // Cập nhật state với dữ liệu nhận được
            setError(null); // Xóa lỗi nếu có
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false); // Kết thúc quá trình loading
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchStaticalAds(startDate, endDate, nameShop); // Gọi hàm fetch ban đầu
    }, []); // Mảng rỗng nghĩa là chỉ gọi khi component được mount

    // Xử lý khi người dùng nhấn nút "Lọc"
    const handleFilter = (e) => {
        e.preventDefault(); // Ngăn chặn reload trang
        
        // Kiểm tra ngày nhập
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setDateError('Ngày bắt đầu không thể lớn hơn ngày kết thúc.');
            return; // Dừng lại nếu có lỗi
        } else {
            setDateError(''); // Reset lỗi nếu hợp lệ
        }

        fetchStaticalAds(startDate, endDate, nameShop); // Gọi API với giá trị mới của startDate, endDate, shopId
        setCurrentPage(1); // Reset về trang 1 khi lọc
    };

    // Hàm nhóm dữ liệu theo `buyDay` và `nameShop` và cộng dồn các giá trị
    const groupByDateAndShop = (ads) => {
        return ads.reduce((acc, current) => {
            const { buyDay, nameShop, discount, totalPayment } = current;
            const key = `${buyDay}-${nameShop}`; // Tạo key dựa trên buyDay và nameShop

            if (!acc[key]) {
                acc[key] = {
                    buyDay,
                    nameShop,
                    totalDiscount: 0,
                    totalPayment: 0
                };
            }

            acc[key].totalDiscount += discount;
            acc[key].totalPayment += totalPayment;

            return acc;
        }, {});
    };

    // Nhóm dữ liệu theo ngày và tên shop
    const groupedAds = Object.values(groupByDateAndShop(staticalAds));

    // Tính toán dữ liệu hiển thị theo trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAds = groupedAds.slice(indexOfFirstItem, indexOfLastItem); // Chỉ lấy 10 kết quả

    // Tổng số trang
    const totalPages = Math.ceil(groupedAds.length / itemsPerPage);

    // Hàm để chuyển sang trang tiếp theo
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Hàm để chuyển về trang trước đó
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Thống kê</h2>

            {/* Form lọc dữ liệu */}
            <form onSubmit={handleFilter} className="mb-4">
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Ngày bắt đầu:</label>
                    <input
                        type="date"
                        id="startDate"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">Ngày kết thúc:</label>
                    <input
                        type="date"
                        id="endDate"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="nameShop" className="form-label">Tên Shop:</label>
                    <input
                        type="number"
                        id="nameShop"
                        className="form-control"
                        value={nameShop}
                        onChange={(e) => setShopId(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Lọc</button>
                {dateError && <p className="text-danger">{dateError}</p>} {/* Hiển thị lỗi ngày */}
            </form>

            {/* Hiển thị trạng thái loading */}
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* Hiển thị bảng nếu có dữ liệu */}
            {!loading && currentAds.length > 0 && (
                <>
                    <table className="table table-striped table-hover mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Ngày mua</th>
                                <th scope="col">Tên Shop</th>
                                <th scope="col">Tổng Chiết khấu</th>
                                <th scope="col">Tổng thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAds.map((ad) => (
                                <tr key={`${ad.buyDay}-${ad.nameShop}`}>
                                    <td>{ad.buyDay}</td>
                                    <td>{ad.nameShop}</td>
                                    <td>{ad.totalDiscount}</td>
                                    <td>{ad.totalPayment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-secondary"
                            onClick={prevPage}
                            disabled={currentPage === 1} // Vô hiệu hóa nút nếu đang ở trang đầu
                        >
                            Trang trước
                        </button>
                        <span>Trang {currentPage} / {totalPages}</span>
                        <button
                            className="btn btn-secondary"
                            onClick={nextPage}
                            disabled={currentPage === totalPages} // Vô hiệu hóa nút nếu đang ở trang cuối
                        >
                            Tiếp theo
                        </button>
                    </div>

                    {/* Biểu đồ cột theo discount */}
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={currentAds}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={(ad) => `${ad.nameShop} - ${ad.buyDay}`} /> {/* Chú thích tên shop và ngày bán */}
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalDiscount" fill="#82ca9d" name="Tổng Chiết khấu" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}

            {/* Hiển thị thông báo khi không có dữ liệu */}
            {!loading && currentAds.length === 0 && !error && (
                <p>Không có dữ liệu hiển thị.</p>
            )}
        </div>
    );
};

export default StaticalAd;
