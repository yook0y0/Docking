package kr.co.docking.service;

import kr.co.docking.dao.service.GenericService;
import kr.co.docking.dao.serviceImpl.GenericServiceImpl;
import kr.co.docking.util.JsonParser;
import kr.co.docking.vo.MemberVO;

public class MemberServiceImpl implements MemberService {

	@Override
	public Integer memberAdd(MemberVO member) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		memService.add("member_add", member);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public Integer memberModify(MemberVO member) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		memService.modify("member_modify", member);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}

	@Override
	public String memberSearch(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		MemberVO mvo = memService.search("member_search", memberId);

		String jRes = null;
		JsonParser.getInstance();
		/*
		 * Json 타입 캐스팅 필요
		 */
		return jRes;
	}

	@Override
	public Integer memberDelete(String memberId) {
		// TODO Auto-generated method stub
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.delete("member_delete", memberId);

		Integer res = 0;
		/*
		 * res 값 처리 필요
		 */
		return res;
	}
}
