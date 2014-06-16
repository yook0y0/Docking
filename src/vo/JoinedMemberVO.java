package vo;

import java.io.Serializable;

public class JoinedMemberVO	implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private	String	key;
	private String	docId;
	private	Integer	flag;
	private String	memberId;
	
	public Integer getFlag() {
		return flag;
	}
	public void setFlag(Integer flag) {
		this.flag = flag;
	}
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
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	
	@Override
	public String toString() {
		return "JoinedMemberVO [key=" + key + ", docId=" + docId + ", flag="
				+ flag + ", memberId=" + memberId + "]";
	}
}
