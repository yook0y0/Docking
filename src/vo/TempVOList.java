//package vo;
//
//import java.util.ArrayList;
//import java.util.Calendar;
//import java.util.List;
//
//import vo.TempVO;
//
//public class TempVOList {
//	
//	private String contentsId;
//	private List<TempVO> tempList;
//
//	public String getContentsId() {
//		return contentsId;
//	}
//
//	public void setContentsId(String contentsId) {
//		this.contentsId = contentsId;
//	}
//
//	public List<TempVO> getTempList() {
//		return tempList;
//	}
//
//	public void setTempList(List<TempVO> tempList) {
//		this.tempList = tempList;
//	}
//
//	public void add(TempVO tempVO) throws Exception {
//		tempList.add(tempVO);
//	}
//
//	public void modify(TempVO oldInfo, TempVO newInfo) throws Exception {
//		int index = tempList.indexOf(oldInfo);
//		tempList.remove(oldInfo);
//		tempList.add(index, newInfo);
//	}
//
//	public void delete(TempVO tempVO) throws Exception {
//		tempList.remove(tempVO);
//	}
//
//	public void delete(Calendar date) throws Exception {
//		for (TempVO temp : tempList) {
//			if (temp.getDate().equals(date)) {
//				tempList.remove(temp);
//			}
//		}
//	}
//
//	public void delete(String editor) throws Exception {
//		for (TempVO temp : tempList) {
//			if (temp.getEditor().equals(editor)) {
//				tempList.remove(temp);
//			}
//		}
//	}
//
//	public List<TempVO> search() throws Exception {
//		return tempList;
//	}
//
//	public List<TempVO> searchByDate(Calendar date) throws Exception {
//		List<TempVO> list = new ArrayList<TempVO>();
//
//		for (TempVO temp : tempList) {
//			if (temp.getDate().equals(date)) {
//				list.add(temp);
//			}
//		}
//
//		return list;
//	}
//
//	public List<TempVO> searchByEditor(String editor) throws Exception {
//		List<TempVO> list = new ArrayList<TempVO>();
//
//		for (TempVO temp : tempList) {
//			if (temp.getEditor().equals(editor)) {
//				list.add(temp);
//			}
//		}
//
//		return list;
//	}
//}
