package vo;

import java.io.Serializable;

public class MemberContentsVO	implements	Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private	String	memberId;
	private	String	docId;
	
	public String getMemberId() {
		return memberId;
	}
	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}
	public String getDocId() {
		return docId;
	}
	public void setDocId(String docId) {
		this.docId = docId;
	}
	
	@Override
	public String toString() {
		return "MemberContentsVO [memberId=" + memberId + ", docId=" + docId
				+ "]";
	}
}
