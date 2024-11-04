/*  - get_attendance_list: gv xem lại điểm danh vào 1 ngày cụ thể
        + Mô tả: API này cho phép giảng viên điểm danh sinh viên trong một lớp học vào một ngày cụ thể.
        + Request dạng: POST
        + Tham số:
            token: Mã phiên đăng nhập của giảng viên.
            class_id: ID của lớp học.
            date: Ngày điểm danh (định dạng YYYY-MM-DD).
            attendance_list: Danh sách ID của sinh viên vắng mặt

    - take_attendance: gv tạo 1 bản ghi điểm danh mới
        + Mô tả: API này cho phép giảng viên cập nhật trạng thái điểm danh của sinh viên sau khi điểm danh ban đầu.
        + Request dạng: POST
        + Tham số:
            token: Mã phiên đăng nhập của giảng viên.
            attendance_id: ID bản ghi điểm danh.
            status: Trạng thái mới của sinh viên (có mặt/vắng mặt).

    - set_attendance_status : gv cập nhật trạng thái điểm danh của mỗi sv trong mỗi bản ghi
        + Mô tả: API này cho phép giảng viên cập nhật trạng thái điểm danh của sinh viên sau khi điểm danh ban đầu.
        + Request dạng: POST
        + Tham số:
            token: Mã phiên đăng nhập của giảng viên.
            attendance_id: ID bản ghi điểm danh.
            status: Trạng thái mới của sinh viên (có mặt/vắng mặt).

*/


// import { Text, View } from 'react-native';

// export default function TakeAttendanceScreen() {
//     return (
//         <View
//             style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//             }}
//         >
//             <Text>Do attendance here</Text>
//         </View>
//     );
// }


import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';

const DATA = [
  {
      "id": "58694a0f-3da1-471f-bd96-145571e29d74",
      "name": "Lê Trọng Bảo An",
      "MSSV": "20215295",
      "status": "có mặt"
  },
  {
      "id": "b1a2c3d4-e5f6-7890-1234-56789abcdef0",
      "name": "Hoàng Kỳ Anh",
      "MSSV": "20210068",
      "status": "có mặt"
  },
  {
      "id": "12345678-90ab-cdef-1234-567890abcdef",
      "name": "Nguyễn Thuý Anh",
      "MSSV": "20215306",
      "status": "có mặt"
  },
  {
      "id": "abcdef12-3456-7890-abcd-ef1234567890",
      "name": "Quách Hữu Tùng Anh",
      "MSSV": "20215311",
      "status": "có mặt"
  },
  {
      "id": "fedcba98-7654-3210-fedc-ba9876543210",
      "name": "Trần Minh Chiến",
      "MSSV": "20215321",
      "status": "có mặt"
  },
  {
      "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345678",
      "name": "Nguyễn Quốc Dũng",
      "MSSV": "20215329",
      "status": "có mặt"
  },
  {
      "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8b",
      "name": "Nguyễn Hoàng Dương",
      "MSSV": "20215337",
      "status": "vắng"
  },
  {
      "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef0",
      "name": "Nguyễn Thành Đạt",
      "MSSV": "20215344",
      "status": "vắng"
  },
  {
      "id": "abcdef01-2345-6789-0abc-def123456789",
      "name": "Vũ Hải Đăng",
      "MSSV": "20215347",
      "status": "vắng"
  },
  {
      "id": "12345678-9abc-def0-1234-56789abcdef0",
      "name": "Đinh Nhẫn Đức",
      "MSSV": "20215350",
      "status": "có mặt"
  },
  {
      "id": "0a1b2c3d-4e5f-6789-0abc-def123456789",
      "name": "Nguyễn Trọng Đức",
      "MSSV": "20215356",
      "status": "có mặt"
  },
  {
      "id": "abcdef12-3456-7890-abcd-ef1234567891",
      "name": "Nguyễn Đức Hải",
      "MSSV": "20210313",
      "status": "có mặt"
  },
  {
      "id": "fedcba98-7654-3210-fedc-ba9876543211",
      "name": "Nguyễn Phúc Hiệp",
      "MSSV": "20215367",
      "status": "vắng"
  },
  {
      "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345679",
      "name": "Phạm Trung Hiếu",
      "MSSV": "20215374",
      "status": "có mặt"
  },
  {
      "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8c",
      "name": "Lục Minh Hoàng",
      "MSSV": "20215379",
      "status": "có mặt"
  },
  {
      "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef1",
      "name": "Nguyễn Việt Hoàng",
      "MSSV": "20215384",
      "status": "có mặt"
  },
  {
      "id": "abcdef01-2345-6789-0abc-def12345678a",
      "name": "Nguyễn Vũ Hùng",
      "MSSV": "20210400",
      "status": "có mặt"
  },
  {
      "id": "12345678-9abc-def0-1234-56789abcdef1",
      "name": "Hoàng Nguyễn Huy",
      "MSSV": "20215393",
      "status": "có mặt"
  },
  {
      "id": "0a1b2c3d-4e5f-6789-0abc-def12345678a",
      "name": "Nhuien Tkhi Kam Tu",
      "MSSV": "20210988",
      "status": "có mặt"
  },
  {
      "id": "abcdef12-3456-7890-abcd-ef1234567892",
      "name": "Lie Min Kyonh",
      "MSSV": "20210989",
      "status": "vắng"
  },
  {
      "id": "fedcba98-7654-3210-fedc-ba9876543212",
      "name": "Trần Quang Khải",
      "MSSV": "20215401",
      "status": "có mặt"
  },
  {
      "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345680",
      "name": "Phạm Đăng Khuê",
      "MSSV": "20215406",
      "status": "có mặt"
  },
  {
      "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8d",
      "name": "Nguyễn Hoàng Lâm",
      "MSSV": "20210515",
      "status": "có mặt"
  },
  {
      "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef2",
      "name": "Tô Thái Linh",
      "MSSV": "20215414",
      "status": "có mặt"
  },
  {
      "id": "abcdef01-2345-6789-0abc-def12345678b",
      "name": "Bùi Anh Minh",
      "MSSV": "20215422",
      "status": "có mặt"
  },
  {
      "id": "12345678-9abc-def0-1234-56789abcdef2",
      "name": "Hoàng Trọng Minh",
      "MSSV": "20215427",
      "status": "có mặt"
  },
  {
      "id": "0a1b2c3d-4e5f-6789-0abc-def12345678b",
      "name": "Nguyễn Văn Nam",
      "MSSV": "20210618",
      "status": "có mặt"
  },
  {
      "id": "abcdef12-3456-7890-abcd-ef1234567893",
      "name": "Phạm Thị Thúy Ngần",
      "MSSV": "20215437",
      "status": "có mặt"
  },
  {
      "id": "fedcba98-7654-3210-fedc-ba9876543213",
      "name": "Lê Hà Phi",
      "MSSV": "20215443",
      "status": "có mặt"
  },
  {
      "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345681",
      "name": "Thẩm Lập Phong",
      "MSSV": "20215449",
      "status": "có mặt"
  },
  {
      "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8e",
      "name": "Hà Vĩnh Phước",
      "MSSV": "20215455",
      "status": "có mặt"
  },
  {
      "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef3",
      "name": "Hứa Hành Quân",
      "MSSV": "20215464",
      "status": "có mặt"
  },
  {
      "id": "abcdef01-2345-6789-0abc-def12345678c",
      "name": "Trương Đình Văn Quyền",
      "MSSV": "20215467",
      "status": "có mặt"
  },
  {
      "id": "12345678-9abc-def0-1234-56789abcdef3",
      "name": "Trần Cao Sơn",
      "MSSV": "20215472",
      "status": "có mặt"
  },
  {
      "id": "0a1b2c3d-4e5f-6789-0abc-def12345678c",
      "name": "Nguyễn Duy Tấn",
      "MSSV": "20215478",
      "status": "có mặt"
  },
  {
      "id": "abcdef12-3456-7890-abcd-ef1234567894",
      "name": "Phạm Đình Tú",
      "MSSV": "20210888",
      "status": "có mặt"
  },
  {
      "id": "fedcba98-7654-3210-fedc-ba9876543214",
      "name": "Nguyễn Quang Tuyến",
      "MSSV": "20215510",
      "status": "có mặt"
  },
  {
      "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345682",
      "name": "Lê Thanh Thương",
      "MSSV": "20215485",
      "status": "có mặt"
  },
  {
      "id": "9a8b7c6d-5e4f-3210-1a2b-3c4d5e6f7a8f",
      "name": "Lương Đức Trọng",
      "MSSV": "20215489",
      "status": "có mặt"
  },
  {
      "id": "1a2b3c4d-5e6f-7890-1234-56789abcdef4",
      "name": "Nguyễn Văn Trường",
      "MSSV": "20215496",
      "status": "có mặt"
  },
  {
      "id": "abcdef01-2345-6789-0abc-def12345678d",
      "name": "Lý Quang Vũ",
      "MSSV": "20215517",
      "status": "vắng"
  }
]  

const Note: React.FC<{}> = () => (
  <View style= {styles.note}> 
    <View > 
      <Text style= {{fontSize: 18}}>
        Có mặt:
        <Image
          style={{width: 20, height: 20}}
          source={require('@assets/images/correct.png')}
        />
      </Text>
      <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>15</Text>
      </View>
    </View>

    <View style={styles.separator} />

    <View> 
      <Text style= {{fontSize: 18}}>
        Vắng:
        <Image
          style={{width: 20, height: 20}}
          source={require('@assets/images/Vang.png')}
        />
      </Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>0</Text>
      </View>
    </View>

  </View>
)

const Item:  React.FC<{ name: any, MSSV: any, status: any, index: any }> = ({name, MSSV, status, index}) => (
  <View>
    <View style= {styles.containerItem}>
      <View style={styles.item}>
        <Text style={styles.index}>{index + 1}.</Text>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style= {{color: '#7f8c8d'}}> {MSSV} </Text> 
          <Text style= {{marginTop: 4}}> Vắng: 0 | Vắng CP: 0 </Text> 
        </View>
      </View>
      <TouchableOpacity
          style={[styles.circleButton, {backgroundColor: status == 'vắng' ? '#ff4141' : '#007BFF'}]}
          onPress={() => Alert.alert('Circle Button pressed')}
        >
          {status == 'có mặt' && (<Image
            style={styles.checked}
            source={require('@assets/images/checks.png')}
          />)}
          {(status == 'vắng') && (<Image
            style={styles.absent}
            source={require('@assets/images/vvang.png')}
          />)}
        </TouchableOpacity>
    </View>
    <Divider />
  </View>
);

export const Divider: React.FC<{}> = () => (
  <View style={styles.divider} />
)

export default function TakeAttendanceScreen() {
  const [text, onChangeText] = React.useState('');
  return (
    <SafeAreaView style={styles.container}>

        <Note />

        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10}}> 
          <TextInput
            style= {[styles.input, {backgroundColor: 'white', width: '50%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}]}
            onChangeText= {onChangeText}
            value= {text}
            placeholder= "Tìm kiếm..."
          />
          <View style={{width: 40, height: 40, marginRight: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 10, borderBottomRightRadius: 10}}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require('@assets/images/search.png')}
            />
          </View>
        </View> 
        <FlatList
          style = {{backgroundColor: 'white'}}
          data={DATA}
          renderItem={({item, index}) => <Item name={item.name} MSSV={item.MSSV} status={item.status} index={index}/>}
          keyExtractor={item => item.id.toString()}
        />

      
      <View style={{paddingVertical: 10, paddingHorizontal: 50, backgroundColor: 'white'}}> 
        <TouchableOpacity
          style={{
            backgroundColor: '#007bff',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50
          }}
          onPress={() => Alert.alert('Xác nhận cập nhật điểm danh <modal>')}
        ><Text style={{padding: 0, margin: 0, fontSize: 16, color: 'white'}}>Cập nhật điểm danh</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#f2f2f2'
  },
  containerItem: {
    flex: 1,
    flexDirection: 'row', // Thiết lập hướng bố trí theo hàng
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  item: {
    // paddingLeft: 10,
    // paddingVertical: 10,
    // marginVertical: 8,
    // marginHorizontal: 16,
    flexDirection: 'row',
  },
  index: {
    fontSize: 16,
    marginEnd: 2
  },
  name: {
    fontSize: 16,
    // fontWeight: 'bold'
  },
  divider: {
    borderBottomColor: '#bdc3c7', // Màu sắc của đường kẻ
    borderBottomWidth: 1,      // Độ dày của đường kẻ
    marginVertical: 0,        // Khoảng cách trên và dưới của đường kẻ
  },
  separator: {
    width: 1, // Chiều rộng của đường phân cách
    height: '100%', // Chiều cao của đường phân cách
    backgroundColor: '#ccc', // Màu sắc của đường phân cách
  },
  circleButton: {
    backgroundColor: '#007BFF', // Màu nền của nút
    padding: 15,
    borderRadius: 50, // Làm nút có bo góc hình tròn
    width: 10,       // Đặt kích thước chiều rộng
    height: 10,      // Đặt kích thước chiều cao bằng chiều rộng để nó tròn
    justifyContent: 'center',
    alignItems: 'center', // Canh giữa text trong nút
  },
  checked: {
    width: 25,
    height: 25,
  },
  absent: {
    width: 15,
    height: 15,
  },
  note: {
    backgroundColor: 'white', 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 5
  },
  input: {
    height: 40,
    padding: 10,
  }
});