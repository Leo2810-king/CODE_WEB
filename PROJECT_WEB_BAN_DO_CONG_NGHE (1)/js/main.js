// Xử lý đăng ký khách hàng
$(document).on('submit', '#registerForm', function(e) {
    e.preventDefault();
    const name = $('#registerName').val().trim();
    const email = $('#registerEmail').val().trim();
    const password = $('#registerPassword').val();
    const phone = $('#registerPhone').val().trim();
    const address = $('#registerAddress').val().trim();
    // Kiểm tra hợp lệ và focus vào trường sai
    if (!name || name.length < 2) {
        alert("Họ tên không được để trống và phải từ 2 ký tự trở lên.");
        $('#registerName').focus().addClass('is-invalid');
        return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Email không được để trống và phải đúng định dạng.");
        $('#registerEmail').focus().addClass('is-invalid');
        return;
    }
    if (!password || password.length < 6) {
        alert("Mật khẩu không được để trống và phải từ 6 ký tự trở lên.");
        $('#registerPassword').focus().addClass('is-invalid');
        return;
    }
    if (!phone || !/^(0|\+84)[0-9]{9,10}$/.test(phone)) {
        alert("Số điện thoại phải đúng định dạng Việt Nam (10 số, bắt đầu bằng 0 hoặc +84).");
        $('#registerPhone').focus().addClass('is-invalid');
        return;
    }
    if (!address || address.length < 5) {
        alert("Địa chỉ không được để trống và phải từ 5 ký tự trở lên.");
        $('#registerAddress').focus().addClass('is-invalid');
        return;
    }
    // Lưu thông tin khách hàng vào localStorage
    localStorage.setItem('user', JSON.stringify({ name, email, password, phone, address }));
    $('#registerModal').modal('hide');

    // Hiển thị thông báo đăng ký thành công
    alert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');

    // Chuyển sang form đăng nhập và điền sẵn thông tin
    setTimeout(() => {
        $('#loginEmail').val(email);
        $('#loginPassword').val(''); // Để trống password để user tự nhập lại
        $('#loginModal').modal('show');
        $('#loginPassword').focus(); // Focus vào password field
    }, 500);
});

// Xử lý đăng nhập khách hàng
$(document).on('submit', '#loginForm', function(e) {
    e.preventDefault();
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === email && user.password === password) {
        $('#loginModal').modal('hide');

        // Sử dụng function updateAuthButtons để cập nhật UI  
        updateAuthButtons();

        alert('Đăng nhập thành công!');

        // Clear form
        $('#loginEmail').val('');
        $('#loginPassword').val('');
    } else {
        alert('Email hoặc mật khẩu không đúng!');
        $('#loginPassword').focus(); // Focus lại password để nhập lại
    }
});

// Function cập nhật trạng thái authentication buttons
function updateAuthButtons() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Xóa thông tin user cũ trước
    $('.user-greeting').remove();

    if (user && user.name) {
        $('#loginBtn').hide();
        $('#registerBtn').hide();
        $('#logoutBtn').show();
        $('#customerInfoBtn').show();

        // Thêm lời chào người dùng
        if ($('.user-greeting').length === 0) {
            $('.navbar-nav').append(`<li class="nav-item user-greeting"><span class="nav-link text-success fw-bold">Xin chào, ${user.name}!</span></li>`);
        }
    } else {
        $('#loginBtn').show();
        $('#registerBtn').show();
        $('#logoutBtn').hide();
        $('#customerInfoBtn').hide();
    }
}

$(document).ready(function() {
            // Validation real-time cho form đăng ký
            $('#registerName').on('input', function() {
                const val = $(this).val().trim();
                if (val.length >= 2) $(this).removeClass('is-invalid').addClass('is-valid');
                else $(this).removeClass('is-valid').addClass('is-invalid');
            });
            $('#registerEmail').on('input', function() {
                const val = $(this).val().trim();
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) $(this).removeClass('is-invalid').addClass('is-valid');
                else $(this).removeClass('is-valid').addClass('is-invalid');
            });
            $('#registerPassword').on('input', function() {
                const val = $(this).val();
                if (val.length >= 6) $(this).removeClass('is-invalid').addClass('is-valid');
                else $(this).removeClass('is-valid').addClass('is-invalid');
            });
            $('#registerPhone').on('input', function() {
                const val = $(this).val().trim();
                if (/^(0|\+84)[0-9]{9,10}$/.test(val)) $(this).removeClass('is-invalid').addClass('is-valid');
                else $(this).removeClass('is-valid').addClass('is-invalid');
            });
            $('#registerAddress').on('input', function() {
                const val = $(this).val().trim();
                if (val.length >= 5) $(this).removeClass('is-invalid').addClass('is-valid');
                else $(this).removeClass('is-valid').addClass('is-invalid');
            });

            // Chat AI cố định bên phải màn hình
            $(document).on('submit', '#aiChatForm', function(e) {
                e.preventDefault();
                const input = $('#aiChatInput').val().trim();
                if (!input) return;
                $('#aiChatMessages').append(`<div class='mb-2 text-end'><span class='badge bg-primary'>Bạn</span> <span>${input}</span></div>`);
                $('#aiChatInput').val('');
                setTimeout(() => {
                    // Demo: trả lời mẫu, có thể thay bằng gọi API ChatGPT
                    $('#aiChatMessages').append(`<div class='mb-2 text-start'><span class='badge bg-success'>AI</span> <span>Đây là phản hồi từ ChatGPT cho: ${input}</span></div>`);
                    $('#aiChatMessages').scrollTop($('#aiChatMessages')[0].scrollHeight);
                    // Hiện thông báo tin nhắn mới nếu chat đang đóng
                    if (typeof showChatNotification === 'function') {
                        showChatNotification();
                    }
                }, 800);
            });

            // Xử lý đặt hàng: lưu phương thức thanh toán
            $(document).on('submit', '#customerForm', function(e) {
                e.preventDefault();
                const name = $('#customerName').val();
                const phone = $('#customerPhone').val();
                const address = $('#customerAddress').val();
                const payment = $('#paymentMethod').val();

                // Kiểm tra xem là mua ngay hay thanh toán giỏ hàng
                const buyNowProduct = JSON.parse(localStorage.getItem('buyNowProduct') || 'null');
                let orderInfo = '';

                if (buyNowProduct) {
                    // Mua ngay 1 sản phẩm
                    orderInfo = `Mua ngay: ${buyNowProduct.title} - ${buyNowProduct.price}`;
                    localStorage.removeItem('buyNowProduct');
                } else {
                    // Thanh toán giỏ hàng
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    orderInfo = `Giỏ hàng: ${cart.length} sản phẩm`;

                    // Xóa sạch giỏ hàng sau khi thanh toán
                    localStorage.setItem('cart', '[]');
                    $('#cartCount').text('0');

                    // Cập nhật hiển thị giỏ hàng trống
                    $('#cartItems').html('<p class="text-center text-muted">Giỏ hàng trống</p>');
                }

                const paymentText = payment === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
                    payment === 'bank' ? 'Chuyển khoản ngân hàng' : 'Ví điện tử';

                alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\n📦 ${orderInfo}\n👤 Tên: ${name}\n📞 SĐT: ${phone}\n📍 Địa chỉ: ${address}\n💳 Phương thức: ${paymentText}\n\n✅ Giỏ hàng đã được xóa sạch!\nCảm ơn bạn đã mua hàng! 🛍️`);

                // Đóng modal thanh toán
                $('#checkoutModal').modal('hide');

                // Nếu cart modal đang mở thì cập nhật hiển thị
                if ($('#cartModal').hasClass('show')) {
                    $('#cartModal').modal('hide');
                }

                // Reset form thanh toán
                $('#customerForm')[0].reset();
            });
            // Chuyển đổi giữa trang chủ và danh mục sản phẩm
            $('#homeTab').on('click', function(e) {
                e.preventDefault();
                $('#homeTab').addClass('active');
                $('#productTab').removeClass('active');
                $('#homeSection').show();
                $('#productSection').hide();
            });
            $('#productTab').on('click', function(e) {
                e.preventDefault();
                $('#productTab').addClass('active');
                $('#homeTab').removeClass('active');
                $('#homeSection').hide();
                $('#productSection').show();
            });

            // Khởi tạo trạng thái authentication khi load trang
            updateAuthButtons();

            // Xử lý đăng xuất
            $('#logoutBtn').on('click', function() {
                localStorage.removeItem('user');
                updateAuthButtons();

                // Clear forms
                $('#loginEmail').val('');
                $('#loginPassword').val('');
                $('#registerForm')[0].reset();
                $('.form-control').removeClass('is-valid is-invalid');

                alert('Đã đăng xuất thành công!');
            });

            // Hiển thị thông tin khách hàng trong modal
            $('#customerInfoBtn').on('click', function() {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user && user.name) {
                    $('#customerInfoContent').html(`
                <p><strong>Họ tên:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Số điện thoại:</strong> ${user.phone}</p>
                <p><strong>Địa chỉ:</strong> ${user.address}</p>
            `);
                } else {
                    $('#customerInfoContent').html('<p>Bạn chưa đăng nhập hoặc chưa đăng ký.</p>');
                }
            });

            // Sản phẩm mẫu
            const products = [
                // Mac - 15 sản phẩm
                { title: "MacBook Pro M3 14-inch", price: "45.000.000₫", category: "mac", img: "../img/Macbook pro.webp", badge: "Mac", description: "Chip M3 mạnh mẽ, màn hình Liquid Retina XDR 14 inch" },
                { title: "MacBook Pro M3 Max 16-inch", price: "75.000.000₫", category: "mac", img: "../img/Mac M3 16-icnh.webp", badge: "Mac", description: "Hiệu năng đỉnh cao với chip M3 Max" },
                { title: "MacBook Pro M2 16-inch", price: "52.000.000₫", category: "mac", img: "../img/Mac M2 16-icnh.webp", badge: "Mac", description: "Thiết kế thanh lịch, hiệu năng vượt trội" },
                { title: "MacBook Air M3 15-inch", price: "35.000.000₫", category: "mac", img: "../img/Mac M3 15-icnh.webp", badge: "Mac", description: "Màn hình lớn 15 inch, siêu mỏng nhẹ" },
                { title: "MacBook Air M2 13-inch", price: "28.000.000₫", category: "mac", img: "../img/Mac AIR PRO 13-ICN.webp", badge: "Mac", description: "Compact và mạnh mẽ cho công việc hàng ngày" },
                { title: "MacBook Air M1", price: "22.000.000₫", category: "mac", img: "../img/Mac air m1.webp", badge: "Mac", description: "Hiệu năng ổn định, giá tốt nhất" },
                { title: "iMac 24-inch M3", price: "35.000.000₫", category: "mac", img: "../img/iMac M3.webp", badge: "Mac", description: "All-in-one đẹp mắt với 7 màu sắc" },
                { title: "iMac 24-inch M1", price: "30.000.000₫", category: "mac", img: "../img/iMac M1.webp", badge: "Mac", description: "Thiết kế iconic, hiệu năng tin cậy" },
                { title: "Mac Studio M2 Max", price: "55.000.000₫", category: "mac", img: "../img/Mac studio M2 Max.webp", badge: "Mac", description: "Workstation compact cho chuyên gia" },
                { title: "Mac Studio M2 Ultra", price: "95.000.000₫", category: "mac", img: "../img/Mac studio M2 Ultra.webp", badge: "Mac", description: "Sức mạnh tối đa trong thiết kế nhỏ gọn" },
                { title: "Mac Pro M2 Ultra", price: "175.000.000₫", category: "mac", img: "../img/Mac Pro M2 Ultra.webp", badge: "Mac", description: "Workstation chuyên nghiệp cao cấp nhất" },
                { title: "Mac mini M2", price: "15.000.000₫", category: "mac", img: "../img/Mac mini M2.webp", badge: "Mac", description: "Desktop nhỏ gọn, hiệu năng lớn" },
                { title: "Mac mini M2 Pro", price: "32.000.000₫", category: "mac", img: "../img/Mac mini M2 Pro.webp", badge: "Mac", description: "Nâng cấp hiệu năng cho Mac mini" },
                { title: "MacBook Pro M1 Pro 14-inch", price: "48.000.000₫", category: "mac", img: "../img/Mac pro M1 Pro.webp", badge: "Mac", description: "Thế hệ trước vẫn mạnh mẽ" },
                { title: "MacBook Pro M1 Max 16-inch", price: "62.000.000₫", category: "mac", img: "../img/Mac Pro M1 Max.webp", badge: "Mac", description: "Hiệu năng cao với giá hợp lý hơn" },

                // iPhone - 18sản phẩm
                { title: "iPhone 15 Pro Max 1TB", price: "38.000.000₫", category: "iphone", img: "../img/15 prm 1TB.jpg", badge: "iPhone", description: "iPhone cao cấp nhất với titanium" },
                { title: "iPhone 15 Pro Max 512GB", price: "35.000.000₫", category: "iphone", img: "../img/15 prm 512GB.jpg", badge: "iPhone", description: "Dung lượng lớn cho người dùng chuyên nghiệp" },
                { title: "iPhone 15 Pro Max 256GB", price: "32.000.000₫", category: "iphone", img: "../img/15 prm 256GB.jpg", badge: "iPhone", description: "Phiên bản tiêu chuẩn iPhone Pro Max" },
                { title: "iPhone 15 Pro 1TB", price: "32.000.000₫", category: "iphone", img: "../img/15 pro 1TB.jpg", badge: "iPhone", description: "Pro với dung lượng khủng" },
                { title: "iPhone 15 Pro 512GB", price: "30.000.000₫", category: "iphone", img: "../img/15 pro 512GB.jpg", badge: "iPhone", description: "Cân bằng tốt giữa hiệu năng và giá" },
                { title: "iPhone 15 Pro 256GB", price: "28.000.000₫", category: "iphone", img: "../img/15 pro 256GB.jpg", badge: "iPhone", description: "iPhone Pro entry-level" },
                { title: "iPhone 15 Plus 512GB", price: "26.000.000₫", category: "iphone", img: "../img/15 plus 512GB.jpg", badge: "iPhone", description: "Màn hình lớn, pin trâu" },
                { title: "iPhone 15 Plus 256GB", price: "24.000.000₫", category: "iphone", img: "../img/15 plus 256GB.jpg", badge: "iPhone", description: "iPhone Plus với Dynamic Island" },
                { title: "iPhone 15 256GB", price: "22.000.000₫", category: "iphone", img: "../img/15 256.jpg", badge: "iPhone", description: "iPhone tiêu chuẩn mới nhất" },
                { title: "iPhone 15 128GB", price: "20.000.000₫", category: "iphone", img: "../img/15 128GB.jpg", badge: "iPhone", description: "Entry-level iPhone 15" },
                { title: "iPhone 14 Pro Max", price: "28.000.000₫", category: "iphone", img: "../img/14 prm.jpg", badge: "iPhone", description: "Pro Max thế hệ trước, vẫn mạnh mẽ" },
                { title: "iPhone 14 Pro", price: "25.000.000₫", category: "iphone", img: "../img/14 pro.jpg", badge: "iPhone", description: "Dynamic Island đầu tiên" },
                { title: "iPhone 14 Plus", price: "20.000.000₫", category: "iphone", img: "../img/14 plus.jpg", badge: "iPhone", description: "Màn hình lớn với giá hợp lý" },
                { title: "iPhone 14", price: "18.000.000₫", category: "iphone", img: "../img/14.jpg", badge: "iPhone", description: "iPhone 14 tiêu chuẩn" },
                { title: "iPhone 13 Pro Max", price: "25.000.000₫", category: "iphone", img: "../img/13 prm.jpg", badge: "iPhone", description: "Pro Max với ProMotion 120Hz" },
                { title: "iPhone 13 Pro", price: "22.000.000₫", category: "iphone", img: "../img/13 pro.jpg", badge: "iPhone", description: "iPhone 13 Pro compact" },
                { title: "iPhone 13", price: "16.000.000₫", category: "iphone", img: "../img/13.jpg", badge: "iPhone", description: "iPhone 13 phổ thông" },
                { title: "iPhone 13 mini", price: "14.000.000₫", category: "iphone", img: "../img/13 mini.jpg", badge: "iPhone", description: "iPhone nhỏ gọn nhất" },


                // iPad - 10 sản phẩm
                { title: "iPad Pro 12.9-inch M2 2TB", price: "65.000.000₫", category: "ipad", img: "../img/ipad pro M2 2TB.png", badge: "iPad", description: "iPad Pro cao cấp nhất với M2" },
                { title: "iPad Pro 12.9-inch M2 1TB", price: "55.000.000₫", category: "ipad", img: "../img/ipad pro M2 1TB.png", badge: "iPad", description: "iPad Pro M2 dung lượng lớn" },
                { title: "iPad Pro 12.9-inch M2 512GB", price: "45.000.000₫", category: "ipad", img: "../img/ipad pro M2 512GB.png", badge: "iPad", description: "iPad Pro M2 512GB WiFi" },
                { title: "iPad Pro 12.9-inch M2 256GB", price: "35.000.000₫", category: "ipad", img: "../img/ipad pro M2 256GB.png", badge: "iPad", description: "iPad Pro M2 entry-level" },
                { title: "iPad Pro 11-inch M2 2TB", price: "58.000.000₫", category: "ipad", img: "../img/ipad pro 11icnh 2TB.jpg", badge: "iPad", description: "iPad Pro 11 inch cao cấp" },
                { title: "iPad Pro 11-inch M2 1TB", price: "48.000.000₫", category: "ipad", img: "../img/ipad pro 11icnh 1TB.jpg", badge: "iPad", description: "iPad Pro 11 inch 1TB" },
                { title: "iPad Pro 11-inch M2 512GB", price: "38.000.000₫", category: "ipad", img: "../img/ipad pro 11icnh 512GB.jpg", badge: "iPad", description: "iPad Pro 11 inch 512GB" },
                { title: "iPad Pro 11-inch M2 256GB", price: "30.000.000₫", category: "ipad", img: "../img/ipad pro 11icnh 256GB.jpg", badge: "iPad", description: "iPad Pro 11 inch cơ bản" },
                { title: "iPad Air 10.9-inch M1 256GB", price: "18.000.000₫", category: "ipad", img: "../img/ipad air M1 256GB.jpg", badge: "iPad", description: "iPad Air với chip M1 mạnh mẽ" },
                { title: "iPad Air 10.9-inch M1 64GB", price: "15.000.000₫", category: "ipad", img: "../img/ipad air M1 64GB.jpg", badge: "iPad", description: "iPad Air M1 phiên bản cơ bản" },

                // Tai nghe - 4 sản phẩm
                { title: "AirPods Pro 2nd Gen", price: "6.000.000₫", category: "phukien", img: "../img/airpods pro 2nd gen.jpg", badge: "Phụ kiện", description: "AirPods Pro với chip H2 mới" },
                { title: "AirPods 3rd Gen", price: "4.500.000₫", category: "phukien", img: "../img/airpod 3rd gen.jpg", badge: "Phụ kiện", description: "AirPods thế hệ 3 với Spatial Audio" },
                { title: "AirPods 2nd Gen", price: "3.200.000₫", category: "phukien", img: "../img/airpods 2nd gen.jpg", badge: "Phụ kiện", description: "AirPods cơ bản với giá tốt" },
                { title: "AirPods Max", price: "13.000.000₫", category: "phukien", img: "../img/airpods max.jpg", badge: "Phụ kiện", description: "Tai nghe over-ear cao cấp" },
                // Apple Watch - 10 sản phẩm
                { title: "Apple Watch Ultra 2 49mm", price: "20.000.000₫", category: "watch", img: "../img/apw ultra 2.jpg", badge: "Watch", description: "Apple Watch cao cấp nhất cho thể thao" },
                { title: "Apple Watch Series 9 45mm", price: "12.000.000₫", category: "watch", img: "../img/apw seri 9 45mm.jpg", badge: "Watch", description: "Apple Watch Series 9 màn hình lớn" },
                { title: "Apple Watch Series 9 41mm", price: "10.000.000₫", category: "watch", img: "../img/apw seri 9 41mm.jpg", badge: "Watch", description: "Apple Watch Series 9 compact" },
                { title: "Apple Watch SE 2nd Gen 44mm", price: "7.000.000₫", category: "watch", img: "../img/apw se 2nd gen 44mm.jpg", badge: "Watch", description: "Apple Watch SE thế hệ 2" },
                { title: "Apple Watch SE 2nd Gen 40mm", price: "6.000.000₫", category: "watch", img: "../img/apw se 2nd gen 40mm.jpg", badge: "Watch", description: "Apple Watch SE giá tốt" },
                { title: "Apple Watch Series 8 45mm", price: "10.000.000₫", category: "watch", img: "../img/apw seri8 45mm.jpg", badge: "Watch", description: "Apple Watch Series 8 với cảm biến nhiệt độ" },
                { title: "Apple Watch Series 8 41mm", price: "8.500.000₫", category: "watch", img: "../img/apw seri 8 41mm.jpg", badge: "Watch", description: "Series 8 kích thước nhỏ gọn" },
                { title: "Apple Watch Series 7 45mm", price: "8.000.000₫", category: "watch", img: "../img/apw seri7 45mm.jpg", badge: "Watch", description: "Apple Watch Series 7 màn hình lớn" },
                { title: "Apple Watch Series 7 41mm", price: "7.000.000₫", category: "watch", img: "../img/apw seri7 41mm.jpg", badge: "Watch", description: "Series 7 với màn hình Always-On" },
                { title: "Apple Watch Nike SE", price: "6.500.000₫", category: "watch", img: "../img/apw nike se.jpg", badge: "Watch", description: "Phiên bản Nike dành cho runner" },
                // Phụ kiện - 15sản phẩm
                { title: "Magic Keyboard cho iPad Pro", price: "8.000.000₫", category: "phukien", img: "../img/magic keyboard cho ipad pro.jpg", badge: "Phụ kiện", description: "Bàn phím Magic với trackpad" },
                { title: "Magic Keyboard cho Mac", price: "2.800.000₫", category: "phukien", img: "../img/magic keyboard cho Mac .jpg", badge: "Phụ kiện", description: "Bàn phím không dây Magic Keyboard" },
                { title: "Magic Mouse", price: "2.000.000₫", category: "phukien", img: "../img/magic mouse.jpg", badge: "Phụ kiện", description: "Chuột Magic Mouse với Multi-Touch" },
                { title: "Magic Trackpad", price: "3.200.000₫", category: "phukien", img: "../img/magic trackpad.jpg", badge: "Phụ kiện", description: "Trackpad Magic với Force Touch" },
                { title: "Apple Pencil 2nd Gen", price: "3.000.000₫", category: "phukien", img: "../img/apple pencil 2nd gen.jpg", badge: "Phụ kiện", description: "Bút Apple Pencil thế hệ 2" },
                { title: "Apple Pencil USB-C", price: "2.200.000₫", category: "phukien", img: "../img/apple pencil usbc .jpg", badge: "Phụ kiện", description: "Apple Pencil với cổng USB-C" },
                { title: "MagSafe Charger", price: "1.200.000₫", category: "phukien", img: "../img/magsafe charger.jpg", badge: "Phụ kiện", description: "Sạc không dây MagSafe 15W" },
                { title: "MagSafe Battery Pack", price: "2.500.000₫", category: "phukien", img: "../img/magsafe battery pack.jpg", badge: "Phụ kiện", description: "Pin dự phòng MagSafe" },
                { title: "Lightning to USB-C Cable", price: "600.000₫", category: "phukien", img: "../img/lightning to usb c cable.jpg", badge: "Phụ kiện", description: "Cáp Lightning sang USB-C" },
                { title: "USB-C to Lightning Cable", price: "600.000₫", category: "phukien", img: "../img/usb c to lightning cable.jpg", badge: "Phụ kiện", description: "Cáp USB-C sang Lightning" },
                { title: "20W USB-C Power Adapter", price: "800.000₫", category: "phukien", img: "../img/20w usbc power adapter.jpg", badge: "Phụ kiện", description: "Adapter sạc nhanh 20W" },

            ];

            function renderProducts(category) {
                let filtered = products;
                if (category && category !== 'all') {
                    filtered = products.filter(p => p.category === category);
                }
                const $list = $('#productList');
                $list.empty();
                filtered.forEach((p, idx) => {
                            const badgeClass = p.category === "mac" ? "secondary" :
                                p.category === "iphone" ? "primary" :
                                p.category === "ipad" ? "info" :
                                p.category === "watch" ? "dark" :
                                p.category === "phukien" ? "warning text-dark" : "success";

                            $list.append(`
                <div class='col-12 col-sm-4 col-md-4 col-lg-4 mb-4'>
                    <div class='product-card h-100 d-flex flex-column'>
                        <img src='${p.img}' alt='${p.title}' class='product-img'>
                        <div class='product-content flex-grow-1 d-flex flex-column'>
                            <div class='product-title'>${p.title}</div>
                            <div class='product-price fw-bold text-danger'>${p.price}</div>
                            <span class='badge bg-${badgeClass} mb-2 align-self-start'>${p.badge}</span>
                            ${p.description ? `<small class='text-muted mb-2'>${p.description}</small>` : ''}
                            <div class='mt-auto d-flex gap-2'>
                                <button class='btn btn-sm btn-outline-success add-to-cart-btn flex-fill' data-idx='${idx}' data-product='${JSON.stringify(p).replace(/'/g, "&apos;")}'>
                                    <i class='fas fa-cart-plus me-1'></i>Thêm vào giỏ
                                </button>
                                <button class='btn btn-sm btn-success buy-now-btn flex-fill' data-idx='${idx}' data-product='${JSON.stringify(p).replace(/'/g, "&apos;")}'>
                                    <i class='fas fa-shopping-bag me-1'></i>Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
        // Giỏ hàng
        function getCart() {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        }

        function setCart(cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
            $('#cartCount').text(cart.length);
        }

        function addToCart(product) {
            const cart = getCart();
            cart.push(product);
            setCart(cart);
        }

        function renderCart() {
            const cart = getCart();
            if (cart.length === 0) {
                $('#cartItems').html(`
                    <div class="text-center py-4">
                        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <p class="text-muted fs-5">Giỏ hàng trống</p>
                        <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
                    </div>
                `);
                return;
            }
            let html = '<ul class="list-group">';
            let total = 0;
            cart.forEach((item, i) => {
                // Tính tổng tiền (bỏ dấu chấm và đơn vị tiền tệ)
                const priceNum = parseFloat(item.price.replace(/[^0-9]/g, '')) || 0;
                total += priceNum;
                html += `<li class='list-group-item d-flex justify-content-between align-items-center'>
                    <span>${item.title} - <strong>${item.price}</strong></span>
                    <button class='btn btn-sm btn-danger remove-cart-item' data-idx='${i}'>Xóa</button>
                </li>`;
            });
            html += `</ul><div class='mt-3 p-3 bg-light rounded'><h5 class='text-end mb-0'>Tổng tiền: <span class='text-success'>${total.toLocaleString('vi-VN')}₫</span></h5></div>`;
            $('#cartItems').html(html);
        }
        // Khởi tạo số lượng giỏ hàng khi load
        setCart(getCart());

        // Sự kiện thêm vào giỏ
        $(document).on('click', '.add-to-cart-btn', function () {
            const idx = $(this).data('idx');
            const cat = $('.category-link.active').data('category') || 'all';
            let filtered = products;
            if (cat && cat !== 'all') filtered = products.filter(p => p.category === cat);
            const product = filtered[idx];
            addToCart(product);
            renderCart();
            $('#cartCount').text(getCart().length);
            $('#cartModal').modal('show');
        });

        // Sự kiện mua ngay
        $(document).on('click', '.buy-now-btn', function () {
            const idx = $(this).data('idx');
            const cat = $('.category-link.active').data('category') || 'all';
            let filtered = products;
            if (cat && cat !== 'all') filtered = products.filter(p => p.category === cat);
            const product = filtered[idx];
            // Lưu sản phẩm mua ngay
            localStorage.setItem('buyNowProduct', JSON.stringify(product));
            // Tự động điền thông tin nếu đã đăng nhập
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user && user.name) {
                $('#customerName').val(user.name);
                $('#customerPhone').val(user.phone || '');
                $('#customerAddress').val(user.address || '');
            }
            // Hiển thị modal thanh toán ngay
            $('#checkoutModal').modal('show');
        });

        // Hiển thị giỏ hàng khi nhấn nút giỏ hàng
        $('#cartBtn').on('click', function (e) {
            e.preventDefault();
            renderCart();
            $('#cartModal').modal('show');
        });

        // Xử lý khi nhấn nút thanh toán trong giỏ hàng
        $('#checkoutBtn').on('click', function () {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Giỏ hàng trống!');
                return;
            }
            // Đóng giỏ hàng và mở modal thanh toán
            $('#cartModal').modal('hide');
            setTimeout(() => {
                // Tự động điền thông tin nếu đã đăng nhập
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user && user.name) {
                    $('#customerName').val(user.name);
                    $('#customerPhone').val(user.phone || '');
                    $('#customerAddress').val(user.address || '');
                }
                $('#checkoutModal').modal('show');
            }, 300);
        });

        // Xóa sản phẩm khỏi giỏ
        $(document).on('click', '.remove-cart-item', function () {
            const idx = $(this).data('idx');
            const cart = getCart();
            cart.splice(idx, 1);
            setCart(cart);
            renderCart();

            // Cập nhật counter giỏ hàng
            $('#cartCount').text(cart.length);

            // Hiển thị thông báo
            if (cart.length === 0) {
                setTimeout(() => {
                    alert('Giỏ hàng đã trống');
                }, 100);
            }
        });
    }

    // Hiển thị tất cả sản phẩm khi load
    renderProducts('all');

    // Xử lý chọn danh mục trên header
    $(document).on('click', '.category-link', function (e) {
        e.preventDefault();
        $('.category-link').removeClass('active');
        $(this).addClass('active');
        const cat = $(this).data('category');
        renderProducts(cat);
    });
});