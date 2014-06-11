package vo;

import java.util.List;

import vo.ContentsVO;

public class ContentsVOList {
	
	private String docId;
	private List<ContentsVO> contentsIdList;

	public String getDocId() {
		return docId;
	}

	public void setDocId(String docId) {
		this.docId = docId;
	}

	public List<ContentsVO> getContentsIdList() {
		return contentsIdList;
	}

	public void setContentsIdList(List<ContentsVO> contentsIdList) {
		this.contentsIdList = contentsIdList;
	}

	public void add(ContentsVO contentsVO) throws Exception {
		contentsIdList.add(contentsVO);
	}

	public void modify(ContentsVO oldInfo, ContentsVO newInfo) throws Exception {
		int index = contentsIdList.indexOf(oldInfo);
		contentsIdList.remove(oldInfo);
		contentsIdList.add(index, newInfo);
	}

	public void delete(ContentsVO contentsVO) throws Exception {
		contentsIdList.remove(contentsVO.getContetsId());
	}

	public List<ContentsVO> search() throws Exception {
		return contentsIdList;
	}
}
