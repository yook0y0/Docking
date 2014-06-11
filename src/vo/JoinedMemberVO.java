package vo;

import java.io.Serializable;

public class JoinedMemberVO	implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private	Integer	flag;
	private MemberVO	memberVO;
	
	public Integer getFlag() {
		return flag;
	}
	public void setFlag(Integer flag) {
		this.flag = flag;
	}
	public MemberVO getMemberVO() {
		return memberVO;
	}
	public void setMemberVO(MemberVO memberVO) {
		this.memberVO = memberVO;
	}
	
	@Override
	public String toString() {
		return "JoinedMemberVO [flag=" + flag + ", memberVO=" + memberVO + "]";
	}
}
