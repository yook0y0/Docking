package org.docking.erbse.service;

import org.docking.erbse.vo.MemberVO;

public interface MemberService {

	public Integer memberAdd(MemberVO member);
	public Integer duplicationCheck(String memberId);
	public Integer memberModify(MemberVO member);
	public MemberVO memberSearch(String memberId);
	public String memberSearch(MemberVO member);
	public Integer memberDelete(String memberId);
	public Integer memberLogin(String memberId,String pw);
	public Integer memberAddChk(MemberVO member);
}
